<?php
// =====================================================================
// /api/admin/collaborators.php?slug=foo
//   GET                                — list collaborators
//   POST   body: { email, role }       — invite by email
//   PATCH  body: { userId, role }      — change role
//   DELETE body: { userId }            — remove (cannot remove owner)
//
// Only the tenant owner can mutate. Editors/viewers can list.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::require();
$slug = strtolower(trim($_GET['slug'] ?? ''));
if ($slug === '') Response::error('slug required', 400);

$tenant = DB::one("SELECT * FROM tenants WHERE slug = ? AND status != 'deleted'", [$slug]);
if ($tenant === null) Response::notFound('Tenant not found');
$tenantId = (int) $tenant['id'];

// Determine the caller's role on this tenant.
$myRole = roleOf($tenantId, (int) $user['id'], (int) $tenant['owner_user_id']);
if ($myRole === null) Response::forbidden('No access to this tenant');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ── GET: any role can read ──────────────────────────────────────
if ($method === 'GET') {
    $rows = DB::all(
        "SELECT
            c.user_id, c.role, c.created_at, c.accepted_at, c.invited_email,
            u.email, u.display_name, u.avatar_url
         FROM tenant_collaborators c
         LEFT JOIN users u ON u.id = c.user_id
         WHERE c.tenant_id = ?
         ORDER BY (c.role = 'owner') DESC, c.created_at",
        [$tenantId]
    );
    Response::ok($rows);
}

// ── Mutations: owner only ───────────────────────────────────────
if ($myRole !== 'owner') Response::forbidden('Only the owner can manage collaborators');

if ($method === 'POST') {
    $body  = read_json_body();
    $email = strtolower(trim((string)($body['email'] ?? '')));
    $role  = (string)($body['role'] ?? 'viewer');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) Response::error('כתובת אימייל לא תקינה', 400);
    if (!in_array($role, ['editor', 'viewer'], true)) Response::error('Role must be editor or viewer', 400);
    if ($email === strtolower((string) $user['email'])) Response::error('לא ניתן להזמין את עצמך', 400);

    // If user already exists, link directly.
    $invited = DB::one('SELECT id FROM users WHERE email = ?', [$email]);

    if ($invited) {
        $invitedId = (int) $invited['id'];
        $exists = DB::one('SELECT user_id FROM tenant_collaborators WHERE tenant_id = ? AND user_id = ?', [$tenantId, $invitedId]);
        if ($exists) Response::error('המשתמש כבר משתף בגישה', 409, 'already_collaborator');

        DB::exec(
            "INSERT INTO tenant_collaborators
             (tenant_id, user_id, role, invited_by, invited_email, accepted_at)
             VALUES (?, ?, ?, ?, ?, NOW())",
            [$tenantId, $invitedId, $role, (int) $user['id'], $email]
        );
    } else {
        // No user yet — create a placeholder row by email + token. They
        // accept after first Google sign-in (token-based flow).
        $token = bin2hex(random_bytes(16));
        // Use a synthetic negative user_id to avoid PK collision on (tenant_id, user_id):
        // we'll convert this on accept. For simplicity, just store email-only invite
        // in a separate row by using user_id=0 as "pending". Use a guard.
        $exists = DB::one(
            'SELECT 1 FROM tenant_collaborators WHERE tenant_id = ? AND invited_email = ? AND accepted_at IS NULL',
            [$tenantId, $email]
        );
        if ($exists) Response::error('כבר נשלחה הזמנה לאימייל הזה', 409, 'already_invited');

        // Use a sentinel user_id derived from email hash (negative range to avoid real users).
        // PK is (tenant_id, user_id). For pending invites we use 0 + invited_email is the actual identity.
        // Since we may have multiple pending invites we cannot use 0 — use a hash mod.
        // Simpler: drop the user_id requirement for pending by pre-creating a stub user.
        // Cleanest path: create a stub user row (no google_id) and link.
        $stubId = DB::insert(
            "INSERT INTO users (google_id, email, display_name, avatar_url)
             VALUES (?, ?, ?, NULL)",
            ['pending_' . $token, $email, null]
        );
        DB::exec(
            "INSERT INTO tenant_collaborators
             (tenant_id, user_id, role, invited_by, invited_email, invite_token)
             VALUES (?, ?, ?, ?, ?, ?)",
            [$tenantId, $stubId, $role, (int) $user['id'], $email, $token]
        );
        // TODO: send the invite email (Brevo). For now, return the token in the response so
        // the frontend can show a copyable invite URL.
    }

    Response::ok(['ok' => true]);
}

if ($method === 'PATCH') {
    $body    = read_json_body();
    $userId  = (int) ($body['userId'] ?? 0);
    $newRole = (string)($body['role'] ?? '');
    if ($userId <= 0 || !in_array($newRole, ['editor', 'viewer'], true)) {
        Response::error('Invalid input', 400);
    }
    if ($userId === (int) $tenant['owner_user_id']) Response::error('לא ניתן לשנות את התפקיד של הבעלים', 400);
    DB::exec(
        "UPDATE tenant_collaborators SET role = ? WHERE tenant_id = ? AND user_id = ?",
        [$newRole, $tenantId, $userId]
    );
    Response::ok(['ok' => true]);
}

if ($method === 'DELETE') {
    $body   = read_json_body();
    $userId = (int) ($body['userId'] ?? 0);
    if ($userId <= 0) Response::error('userId required', 400);
    if ($userId === (int) $tenant['owner_user_id']) Response::error('לא ניתן להסיר את הבעלים', 400);
    DB::exec(
        "DELETE FROM tenant_collaborators WHERE tenant_id = ? AND user_id = ?",
        [$tenantId, $userId]
    );
    Response::ok(['ok' => true]);
}

Response::error('Method not allowed', 405);

// ──────────────────────────────────────────────────────────────────
function roleOf(int $tenantId, int $userId, int $ownerUserId): ?string {
    if ($userId === $ownerUserId) return 'owner';
    $row = DB::one(
        'SELECT role FROM tenant_collaborators WHERE tenant_id = ? AND user_id = ?',
        [$tenantId, $userId]
    );
    return $row ? (string) $row['role'] : null;
}
