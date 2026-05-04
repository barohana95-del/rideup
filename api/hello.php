<?php
// =====================================================================
// GET /api/hello.php — בדיקת חיבור.
// מחזיר את ה-tenant אם ה-host הוא subdomain של tenant קיים.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../lib/bootstrap.php';
require_once __DIR__ . '/../lib/tenant.php';

$tenant = null;
try {
    $t = Tenant::current();
    $tenant = $t === null ? null : ['slug' => $t['slug'], 'plan' => $t['plan']];
} catch (Throwable $e) {
    // אם DB לא זמין, רק מדלגים — hello לא דורש tenant.
    $tenant = null;
}

Response::ok([
    'message'   => 'hello from rideup',
    'timestamp' => gmdate('c'),
    'host'      => $_SERVER['HTTP_HOST'] ?? null,
    'tenant'    => $tenant,
]);
