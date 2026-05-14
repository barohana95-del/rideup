<?php
// =====================================================================
// POST /api/admin/archive.php?slug=foo
// Body: { confirm: true }
//
// Owner-only action. Sets tenant status to 'archived' — the public
// RSVP page goes read-only and the panel keeps a "restore" option
// (TODO). Hard delete remains a Super-Admin operation.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::require();
$slug = strtolower(trim($_GET['slug'] ?? ''));
if ($slug === '') Response::error('slug required', 400);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Response::error('Method not allowed', 405);
}

$tenant = DB::one(
    "SELECT id, owner_user_id, status, event_title FROM tenants
     WHERE slug = ? AND status != 'deleted'",
    [$slug]
);
if ($tenant === null) Response::notFound('Tenant not found');
if ((int) $tenant['owner_user_id'] !== (int) $user['id']) {
    Response::forbidden('Only the owner can archive this tenant');
}

$body = read_json_body();
if (empty($body['confirm'])) {
    Response::error('Confirmation required', 400, 'confirm_required');
}

DB::exec(
    "UPDATE tenants SET status = 'archived', updated_at = NOW() WHERE id = ?",
    [(int) $tenant['id']]
);

DB::exec(
    "INSERT INTO audit_log (tenant_id, actor_user_id, action, entity_type, entity_id, ip)
     VALUES (?, ?, 'tenant.archived', 'tenant', ?, ?)",
    [
        (int) $tenant['id'],
        (int) $user['id'],
        (int) $tenant['id'],
        $_SERVER['REMOTE_ADDR'] ?? null,
    ]
);

Response::ok(['archived' => true]);
