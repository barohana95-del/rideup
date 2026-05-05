<?php
// =====================================================================
// GET /api/admin/tenants.php
// Returns all tenants owned by the current user.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::require();

$rows = DB::all(
    "SELECT id, slug, status, plan, theme, event_type, event_title, event_date,
            event_location, trial_ends_at, paid_until, created_at
     FROM tenants
     WHERE owner_user_id = ? AND status != 'deleted'
     ORDER BY created_at DESC",
    [(int) $user['id']]
);

Response::ok($rows);
