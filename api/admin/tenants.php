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
$uid  = (int) $user['id'];

// Tenants the user owns OR collaborates on (editor/viewer accepted invite).
$rows = DB::all(
    "SELECT
        t.id, t.slug, t.status, t.plan, t.theme, t.event_type, t.event_title,
        t.event_date, t.event_location, t.trial_ends_at, t.paid_until, t.created_at,
        CASE
            WHEN t.owner_user_id = ? THEN 'owner'
            ELSE c.role
        END AS my_role,
        (SELECT COUNT(*) FROM registrations r WHERE r.tenant_id = t.id) AS registrations,
        (SELECT COALESCE(SUM(num_guests), 0) FROM registrations r WHERE r.tenant_id = t.id) AS guests
     FROM tenants t
     LEFT JOIN tenant_collaborators c
       ON c.tenant_id = t.id AND c.user_id = ? AND c.accepted_at IS NOT NULL
     WHERE t.status != 'deleted'
       AND (t.owner_user_id = ? OR c.user_id = ?)
     ORDER BY t.created_at DESC",
    [$uid, $uid, $uid, $uid]
);

Response::ok($rows);
