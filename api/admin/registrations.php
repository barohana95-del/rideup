<?php
// =====================================================================
// /api/admin/registrations.php?slug=foo
// GET    — list all registrations for the tenant.
// PATCH  — &id=N body=partial fields → update one registration.
// DELETE — &id=N → soft/hard delete.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::require();
$slug = strtolower(trim($_GET['slug'] ?? ''));
if ($slug === '') Response::error('slug required', 400);

$tenant = DB::one(
    "SELECT id FROM tenants WHERE slug = ? AND owner_user_id = ? AND status != 'deleted'",
    [$slug, (int) $user['id']]
);
if ($tenant === null) Response::notFound('Tenant not found');
$tenantId = (int) $tenant['id'];

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $rows = DB::all(
        "SELECT id, full_name, phone_number, email, num_guests, city, return_shift,
                notes, confirmed_at, created_at, updated_at
         FROM registrations
         WHERE tenant_id = ?
         ORDER BY created_at DESC",
        [$tenantId]
    );
    Response::ok($rows);
}

if ($method === 'PATCH') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) Response::error('id required', 400);
    $body = read_json_body();

    $fields = [];
    $params = [];
    foreach (['full_name', 'phone_number', 'email', 'num_guests', 'city', 'return_shift', 'notes'] as $col) {
        $key = lcfirst(str_replace('_', '', ucwords($col, '_'))); // full_name → fullName
        if (array_key_exists($key, $body)) {
            $fields[] = "`$col` = ?";
            $params[] = $body[$key];
        }
    }
    if (empty($fields)) Response::error('No fields to update', 400);

    $params[] = $id;
    $params[] = $tenantId;
    $changed = DB::exec(
        "UPDATE registrations SET " . implode(', ', $fields) . " WHERE id = ? AND tenant_id = ?",
        $params
    );
    if ($changed === 0) Response::notFound('Registration not found');

    $updated = DB::one('SELECT * FROM registrations WHERE id = ?', [$id]);
    Response::ok($updated);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) Response::error('id required', 400);
    $changed = DB::exec(
        "DELETE FROM registrations WHERE id = ? AND tenant_id = ?",
        [$id, $tenantId]
    );
    Response::ok(['deleted' => $changed > 0]);
}

Response::error('Method not allowed', 405);
