<?php
// =====================================================================
// GET /api/admin/tenant.php?slug=foo
// Returns a single tenant + its cities/shifts/settings, owned by current user.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::require();
$slug = strtolower(trim($_GET['slug'] ?? ''));

$ctx    = TenantAccess::require($slug, $user, 'viewer');
$tenant = $ctx['tenant'];

$cities = DB::all(
    "SELECT id, name, display_order FROM tenant_cities WHERE tenant_id = ? ORDER BY display_order, id",
    [(int) $tenant['id']]
);
$shifts = DB::all(
    "SELECT id, time_label, display_order FROM tenant_shifts WHERE tenant_id = ? ORDER BY display_order, id",
    [(int) $tenant['id']]
);
$settingRows = DB::all(
    "SELECT `key`, `value` FROM tenant_settings WHERE tenant_id = ?",
    [(int) $tenant['id']]
);
$settings = [];
foreach ($settingRows as $r) $settings[$r['key']] = $r['value'];

Response::ok([
    'tenant'   => $tenant,
    'cities'   => $cities,
    'shifts'   => $shifts,
    'settings' => $settings,
]);
