<?php
// =====================================================================
// GET /api/admin/export.php?slug=foo&type=registrations|trip-plan
//
// Returns a CSV download (UTF-8 with BOM so Excel renders Hebrew).
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::require();
$slug = strtolower(trim($_GET['slug'] ?? ''));
$type = trim($_GET['type'] ?? 'registrations');

if ($slug === '') Response::error('slug required', 400);

$tenant = DB::one(
    "SELECT id, slug, event_title, event_date FROM tenants
     WHERE slug = ? AND owner_user_id = ? AND status != 'deleted'",
    [$slug, (int) $user['id']]
);
if ($tenant === null) Response::notFound('Tenant not found');
$tenantId = (int) $tenant['id'];

$today = date('Y-m-d');
$base  = $slug . '_' . $type . '_' . $today . '.csv';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $base . '"');
header('Cache-Control: no-store');

$out = fopen('php://output', 'w');
// UTF-8 BOM so Excel opens Hebrew correctly
fwrite($out, "\xEF\xBB\xBF");

if ($type === 'registrations') {
    fputcsv($out, ['שם מלא', 'טלפון', 'אימייל', 'מס\' אורחים', 'עיר', 'משמרת חזרה', 'הערות', 'נרשם בתאריך']);
    $rows = DB::all(
        "SELECT full_name, phone_number, email, num_guests, city, return_shift, notes, created_at
         FROM registrations
         WHERE tenant_id = ?
         ORDER BY created_at DESC",
        [$tenantId]
    );
    foreach ($rows as $r) {
        fputcsv($out, [
            $r['full_name'],
            $r['phone_number'],
            $r['email'] ?? '',
            (int) $r['num_guests'],
            $r['city'] ?? '',
            $r['return_shift'] ?? '',
            $r['notes'] ?? '',
            $r['created_at'],
        ]);
    }
} elseif ($type === 'trip-plan') {
    fputcsv($out, ['עיר', 'משמרת חזרה', 'אורחים', 'רישומים', 'תכנון אוטובוסים', 'קיבולת', 'מקומות פנויים']);

    $fleet = DB::all(
        "SELECT capacity, label FROM tenant_buses WHERE tenant_id = ? ORDER BY capacity DESC, id",
        [$tenantId]
    );
    $sortedDesc = array_map(fn($b) => ['capacity' => (int) $b['capacity'], 'label' => $b['label']], $fleet);
    $smallest = !empty($sortedDesc) ? end($sortedDesc)['capacity'] : 0;

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

    foreach ($groups as $g) {
        $G = (int) $g['guests'];
        $busList = [];
        $cap = 0;

        if (!empty($sortedDesc) && $G > 0) {
            $remaining = $G;
            $iter = 0;
            while ($remaining > 0 && $iter < 200) {
                $iter++;
                if ($remaining <= $smallest) {
                    $busList[] = $smallest;
                    $cap += $smallest;
                    break;
                }
                $picked = null;
                foreach ($sortedDesc as $b) {
                    if ($b['capacity'] <= $remaining) { $picked = $b['capacity']; break; }
                }
                if ($picked === null) $picked = $smallest;
                $busList[] = $picked;
                $cap += $picked;
                $remaining -= $picked;
            }
        }

        $busSummary = empty($busList)
            ? '—'
            : implode(' + ', array_map(fn($c) => $c . ' מקומות', $busList));

        fputcsv($out, [
            $g['city'],
            $g['shift'],
            $G,
            (int) $g['registrations'],
            $busSummary,
            $cap > 0 ? $cap : '—',
            $cap > 0 ? max(0, $cap - $G) : '—',
        ]);
    }
} else {
    fclose($out);
    Response::error('Unknown export type', 400, 'bad_type');
}

fclose($out);
exit;
