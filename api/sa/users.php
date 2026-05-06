<?php
// =====================================================================
// GET /api/sa/users.php?q=
// All platform users with their tenant counts.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

Auth::requireAdmin();

$where  = ['1=1'];
$params = [];

if (!empty($_GET['q'])) {
    $q = '%' . $_GET['q'] . '%';
    $where[]  = '(u.email LIKE ? OR u.display_name LIKE ?)';
    array_push($params, $q, $q);
}

$rows = DB::all(
    "SELECT
        u.id, u.email, u.display_name, u.avatar_url, u.is_admin,
        u.created_at, u.last_login_at,
        (SELECT COUNT(*) FROM tenants t WHERE t.owner_user_id = u.id AND t.status != 'deleted') AS tenants_count
     FROM users u
     WHERE " . implode(' AND ', $where) . "
     ORDER BY u.created_at DESC
     LIMIT 200",
    $params
);

Response::ok($rows);
