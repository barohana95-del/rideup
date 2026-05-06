<?php
// =====================================================================
// GET /api/sa/tenants.php?q=&plan=&status=
// All tenants across the platform, with optional filters.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

Auth::requireAdmin();

$where  = ["t.status != 'deleted'"];
$params = [];

if (!empty($_GET['plan'])) {
    $where[]  = 't.plan = ?';
    $params[] = $_GET['plan'];
}
if (!empty($_GET['status'])) {
    $where[]  = 't.status = ?';
    $params[] = $_GET['status'];
}
if (!empty($_GET['q'])) {
    $q = '%' . $_GET['q'] . '%';
    $where[]  = '(t.slug LIKE ? OR t.event_title LIKE ? OR u.email LIKE ?)';
    array_push($params, $q, $q, $q);
}

$rows = DB::all(
    "SELECT
        t.id, t.slug, t.status, t.plan, t.theme, t.event_type, t.event_title,
        t.event_date, t.event_location, t.trial_ends_at, t.paid_until,
        t.created_at, t.updated_at,
        u.id AS owner_id, u.email AS owner_email, u.display_name AS owner_name,
        (SELECT COUNT(*) FROM registrations r WHERE r.tenant_id = t.id) AS registrations,
        (SELECT COALESCE(SUM(num_guests), 0) FROM registrations r WHERE r.tenant_id = t.id) AS guests
     FROM tenants t
     LEFT JOIN users u ON u.id = t.owner_user_id
     WHERE " . implode(' AND ', $where) . "
     ORDER BY t.created_at DESC
     LIMIT 200",
    $params
);

Response::ok($rows);
