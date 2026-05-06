<?php
// =====================================================================
// GET /api/sa/overview.php
// Platform-wide stats for the Super-Admin dashboard.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

Auth::requireAdmin();

// Tenants by status
$byStatus = DB::all(
    "SELECT status, COUNT(*) AS n FROM tenants WHERE status != 'deleted' GROUP BY status"
);
$statusCounts = [];
foreach ($byStatus as $r) $statusCounts[$r['status']] = (int) $r['n'];

// Tenants by plan
$byPlan = DB::all(
    "SELECT plan, COUNT(*) AS n FROM tenants WHERE status != 'deleted' GROUP BY plan"
);
$planCounts = [];
foreach ($byPlan as $r) $planCounts[$r['plan']] = (int) $r['n'];

// Totals
$totals = DB::one(
    "SELECT
        (SELECT COUNT(*) FROM tenants WHERE status != 'deleted') AS tenants,
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM registrations) AS registrations,
        (SELECT COALESCE(SUM(num_guests), 0) FROM registrations) AS guests"
);

// Recent activity (last 7 days)
$recent = DB::one(
    "SELECT
        (SELECT COUNT(*) FROM tenants WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)) AS new_tenants,
        (SELECT COUNT(*) FROM users WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)) AS new_users,
        (SELECT COUNT(*) FROM registrations WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)) AS new_registrations"
);

// Latest 10 tenants
$latestTenants = DB::all(
    "SELECT t.id, t.slug, t.status, t.plan, t.event_title, t.event_date, t.created_at,
            u.email AS owner_email, u.display_name AS owner_name
     FROM tenants t
     LEFT JOIN users u ON u.id = t.owner_user_id
     WHERE t.status != 'deleted'
     ORDER BY t.created_at DESC
     LIMIT 10"
);

Response::ok([
    'totals' => [
        'tenants'       => (int) $totals['tenants'],
        'users'         => (int) $totals['users'],
        'registrations' => (int) $totals['registrations'],
        'guests'        => (int) $totals['guests'],
    ],
    'byStatus'      => $statusCounts,
    'byPlan'        => $planCounts,
    'recent'        => [
        'newTenants'       => (int) $recent['new_tenants'],
        'newUsers'         => (int) $recent['new_users'],
        'newRegistrations' => (int) $recent['new_registrations'],
    ],
    'latestTenants' => $latestTenants,
]);
