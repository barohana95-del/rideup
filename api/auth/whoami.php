<?php
// =====================================================================
// GET /api/auth/whoami.php
//
// Diagnostic endpoint — returns the current user, every tenant they
// own or collaborate on (with their role + accepted state), and any
// orphan stub users that share their email (which would indicate the
// invite-claim flow is stuck).
//
// Useful for troubleshooting "I was invited but I can't see the panel".
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::require();
$uid  = (int) $user['id'];

$tenants = DB::all(
    "SELECT
        t.id, t.slug, t.status, t.owner_user_id,
        CASE
            WHEN t.owner_user_id = ? THEN 'owner'
            ELSE c.role
        END AS my_role,
        c.accepted_at
     FROM tenants t
     LEFT JOIN tenant_collaborators c
       ON c.tenant_id = t.id AND c.user_id = ?
     WHERE t.status != 'deleted'
       AND (t.owner_user_id = ? OR c.user_id = ?)
     ORDER BY t.created_at DESC",
    [$uid, $uid, $uid, $uid]
);

// Orphan stub users sharing this email — should be empty after
// auth/google.php auto-claim runs on next login.
$orphans = DB::all(
    "SELECT id, google_id, last_login_at
     FROM users
     WHERE email = ? AND id != ?",
    [$user['email'], $uid]
);

// Collab rows still pointing at orphans (= access we can't see).
$orphanCollabs = [];
if (!empty($orphans)) {
    $ids = array_map(fn($r) => (int) $r['id'], $orphans);
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $orphanCollabs = DB::all(
        "SELECT c.tenant_id, c.user_id, c.role, c.accepted_at, t.slug
         FROM tenant_collaborators c
         JOIN tenants t ON t.id = c.tenant_id
         WHERE c.user_id IN ($placeholders)",
        $ids
    );
}

Response::ok([
    'user' => [
        'id'           => $uid,
        'email'        => $user['email'],
        'displayName'  => $user['display_name'],
        'isAdmin'      => (int) $user['is_admin'] === 1,
        'googleId'     => $user['google_id'],
        'lastLoginAt'  => $user['last_login_at'] ?? null,
    ],
    'tenants'        => $tenants,
    'orphanUsers'    => $orphans,
    'orphanCollabs'  => $orphanCollabs,
]);
