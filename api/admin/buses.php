<?php
// =====================================================================
// /api/admin/buses.php?slug=foo
//   GET    — list the tenant's bus fleet.
//   POST   — body: { capacity, label? }  → add a bus type.
//   PATCH  — &id=N body: partial → update.
//   DELETE — &id=N → remove.
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

// ── GET ───────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $rows = DB::all(
        "SELECT id, capacity, label, display_order, created_at
         FROM tenant_buses WHERE tenant_id = ? ORDER BY capacity DESC, id",
        [$tenantId]
    );
    Response::ok($rows);
}

// ── POST (add) ────────────────────────────────────────────────────────
if ($method === 'POST') {
    $body = read_json_body();
    $capacity = (int) ($body['capacity'] ?? 0);
    $label = trim((string) ($body['label'] ?? ''));

    if ($capacity < 1 || $capacity > 200) {
        Response::error('Capacity must be between 1 and 200', 400, 'bad_capacity');
    }

    $maxOrder = DB::one(
        "SELECT COALESCE(MAX(display_order), -1) AS m FROM tenant_buses WHERE tenant_id = ?",
        [$tenantId]
    );
    $next = ((int) ($maxOrder['m'] ?? -1)) + 1;

    $id = DB::insert(
        "INSERT INTO tenant_buses (tenant_id, capacity, label, display_order) VALUES (?, ?, ?, ?)",
        [$tenantId, $capacity, $label !== '' ? $label : null, $next]
    );
    $row = DB::one('SELECT * FROM tenant_buses WHERE id = ?', [$id]);
    Response::ok($row);
}

// ── PATCH (update) ────────────────────────────────────────────────────
if ($method === 'PATCH') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) Response::error('id required', 400);
    $body = read_json_body();

    $sets = [];
    $params = [];
    if (isset($body['capacity'])) {
        $cap = (int) $body['capacity'];
        if ($cap < 1 || $cap > 200) Response::error('Capacity must be 1-200', 400);
        $sets[] = 'capacity = ?'; $params[] = $cap;
    }
    if (array_key_exists('label', $body)) {
        $label = trim((string) $body['label']);
        $sets[] = 'label = ?'; $params[] = $label !== '' ? $label : null;
    }
    if (empty($sets)) Response::error('No fields to update', 400);

    $params[] = $id;
    $params[] = $tenantId;
    $changed = DB::exec(
        "UPDATE tenant_buses SET " . implode(', ', $sets) . " WHERE id = ? AND tenant_id = ?",
        $params
    );
    if ($changed === 0) Response::notFound('Bus not found');

    $row = DB::one('SELECT * FROM tenant_buses WHERE id = ?', [$id]);
    Response::ok($row);
}

// ── DELETE ────────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) Response::error('id required', 400);
    $changed = DB::exec(
        "DELETE FROM tenant_buses WHERE id = ? AND tenant_id = ?",
        [$id, $tenantId]
    );
    Response::ok(['deleted' => $changed > 0]);
}

Response::error('Method not allowed', 405);
