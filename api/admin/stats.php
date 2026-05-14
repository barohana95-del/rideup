<?php
// =====================================================================
// GET /api/admin/stats.php?slug=foo
// Returns aggregated stats for the tenant: totals, distribution by city,
// distribution by shift.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::require();
$slug = strtolower(trim($_GET['slug'] ?? ''));

$ctx = TenantAccess::require($slug, $user, 'viewer');
$tenantId = (int) $ctx['tenant']['id'];

// Totals
$totals = DB::one(
    "SELECT COUNT(*) AS total_registrations,
            COALESCE(SUM(num_guests), 0) AS total_guests
     FROM registrations WHERE tenant_id = ?",
    [$tenantId]
);

// Cities
$cities = DB::all(
    "SELECT COALESCE(city, '—') AS city,
            COUNT(*) AS count,
            COALESCE(SUM(num_guests), 0) AS guests
     FROM registrations
     WHERE tenant_id = ?
     GROUP BY city
     ORDER BY guests DESC",
    [$tenantId]
);

// Shifts
$shifts = DB::all(
    "SELECT COALESCE(return_shift, '—') AS shift,
            COUNT(*) AS count,
            COALESCE(SUM(num_guests), 0) AS guests
     FROM registrations
     WHERE tenant_id = ?
     GROUP BY return_shift
     ORDER BY guests DESC",
    [$tenantId]
);

Response::ok([
    'totalRegistrations' => (int) $totals['total_registrations'],
    'totalGuests'        => (int) $totals['total_guests'],
    'cityDistribution'   => array_map(fn($r) => [
        'city'   => $r['city'],
        'count'  => (int) $r['count'],
        'guests' => (int) $r['guests'],
    ], $cities),
    'shiftDistribution'  => array_map(fn($r) => [
        'shift'  => $r['shift'],
        'count'  => (int) $r['count'],
        'guests' => (int) $r['guests'],
    ], $shifts),
]);
