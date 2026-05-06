<?php
// =====================================================================
// GET /api/admin/trip-plan.php?slug=foo
//
// Computes a per-(city, shift) bus assignment for the tenant's current
// registrations using a greedy best-fit algorithm.
//
// Algorithm (per group of guests G):
//   1. If no buses defined → return G with "no_fleet" warning.
//   2. If G == 0 → empty allocation.
//   3. While G > 0:
//        - if G <= smallest bus → assign smallest bus, done.
//        - else → assign LARGEST bus that doesn't overshoot;
//                 if all buses overshoot → assign smallest bus.
//        - subtract that bus's capacity from G.
//   This minimises wasted seats while preferring larger vehicles
//   (fewer buses = lower operational cost for the customer).
//
// Returns:
//   {
//     fleet: [...],
//     groups: [
//       { city, shift, totalGuests, totalRegistrations,
//         buses: [{ capacity, label }],
//         capacityProvided, spareSeats, warning? }
//     ],
//     summary: { totalGuests, totalBuses, totalCapacity, totalSpare }
//   }
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

// 1. Load fleet (sorted desc by capacity)
$fleet = DB::all(
    "SELECT id, capacity, label FROM tenant_buses WHERE tenant_id = ? ORDER BY capacity DESC, id",
    [$tenantId]
);
$fleet = array_map(fn($b) => [
    'id'       => (int) $b['id'],
    'capacity' => (int) $b['capacity'],
    'label'    => $b['label'],
], $fleet);

// 2. Aggregate registrations by (city, shift)
$groups = DB::all(
    "SELECT
        COALESCE(NULLIF(TRIM(city), ''), '—')          AS city,
        COALESCE(NULLIF(TRIM(return_shift), ''), '—')  AS shift,
        COUNT(*)                                        AS registrations,
        COALESCE(SUM(num_guests), 0)                    AS guests
     FROM registrations
     WHERE tenant_id = ?
     GROUP BY city, shift
     HAVING guests > 0
     ORDER BY guests DESC, city",
    [$tenantId]
);

// 3. Plan each group
$totalGuests = 0;
$totalBuses = 0;
$totalCapacity = 0;
$totalSpare = 0;

$plannedGroups = [];
foreach ($groups as $g) {
    $G = (int) $g['guests'];
    $totalGuests += $G;

    $allocation = plan_group($G, $fleet);
    $capacity = array_sum(array_column($allocation['buses'], 'capacity'));
    $spare    = max(0, $capacity - $G);

    $totalBuses    += count($allocation['buses']);
    $totalCapacity += $capacity;
    $totalSpare    += $spare;

    $plannedGroups[] = [
        'city'              => $g['city'],
        'shift'             => $g['shift'],
        'totalGuests'       => $G,
        'totalRegistrations'=> (int) $g['registrations'],
        'buses'             => $allocation['buses'],
        'capacityProvided'  => $capacity,
        'spareSeats'        => $spare,
        'warning'           => $allocation['warning'],
    ];
}

Response::ok([
    'fleet'   => $fleet,
    'groups'  => $plannedGroups,
    'summary' => [
        'totalGuests'   => $totalGuests,
        'totalBuses'    => $totalBuses,
        'totalCapacity' => $totalCapacity,
        'totalSpare'    => $totalSpare,
    ],
]);

// =====================================================================
// Helpers
// =====================================================================

/**
 * Greedy best-fit allocation.
 * @param int $guests       — guests to seat
 * @param array $fleet      — array of ['capacity'=>n, 'label'=>str|null] sorted desc
 * @return array{buses: array, warning: string|null}
 */
function plan_group(int $guests, array $fleet): array {
    if (empty($fleet)) {
        return ['buses' => [], 'warning' => 'no_fleet'];
    }
    if ($guests <= 0) {
        return ['buses' => [], 'warning' => null];
    }

    $sortedDesc = $fleet; // already sorted by query
    $smallest   = end($sortedDesc)['capacity'];

    $allocation = [];
    $remaining  = $guests;
    $iterations = 0;
    $maxIter    = 200;

    while ($remaining > 0 && $iterations < $maxIter) {
        $iterations++;

        // If remaining fits in the smallest bus → use it and stop.
        if ($remaining <= $smallest) {
            $allocation[] = pick_bus_meta($sortedDesc, $smallest);
            $remaining = 0;
            break;
        }

        // Otherwise, take the largest bus that doesn't overshoot.
        // If every bus overshoots, take the smallest.
        $picked = null;
        foreach ($sortedDesc as $b) {
            if ($b['capacity'] <= $remaining) { $picked = $b; break; }
        }
        if ($picked === null) {
            $picked = end($sortedDesc); // smallest
        }
        $allocation[] = ['capacity' => (int) $picked['capacity'], 'label' => $picked['label']];
        $remaining -= (int) $picked['capacity'];
    }

    return ['buses' => $allocation, 'warning' => null];
}

function pick_bus_meta(array $sortedDesc, int $capacity): array {
    foreach ($sortedDesc as $b) {
        if ((int) $b['capacity'] === $capacity) {
            return ['capacity' => $capacity, 'label' => $b['label']];
        }
    }
    return ['capacity' => $capacity, 'label' => null];
}
