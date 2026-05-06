<?php
// api/public/config.php
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/tenant.php';

$tenant = Tenant::require(); // Automatically parses ?tenant= or Host header

$citiesRows = DB::all("SELECT name FROM tenant_cities WHERE tenant_id = ? ORDER BY display_order ASC", [$tenant['id']]);
$cities = array_column($citiesRows, 'name');

$shiftsRows = DB::all("SELECT time_label FROM tenant_shifts WHERE tenant_id = ? ORDER BY display_order ASC", [$tenant['id']]);
$shifts = array_column($shiftsRows, 'time_label');

$settingsRows = DB::all("SELECT `key`, `value` FROM tenant_settings WHERE tenant_id = ?", [$tenant['id']]);
$settings = [];
foreach ($settingsRows as $row) {
    $settings[$row['key']] = $row['value'];
}

$texts = [
    'invitationText' => $settings['invitation_text'] ?? '',
    'instructionsText' => $settings['instructions_text'] ?? '',
    'thankYouText' => $settings['thank_you_text'] ?? ''
];

$config = [
    'slug' => $tenant['slug'],
    'theme' => $tenant['theme'],
    'eventType' => $tenant['event_type'],
    'eventTitle' => $tenant['event_title'] ?? '',
    'eventDate' => $tenant['event_date'],
    'eventTime' => $tenant['event_time'],
    'eventLocation' => $tenant['event_location'],
    'logoUrl' => $tenant['logo_url'],
    'coverImageUrl' => $tenant['cover_image_url'],
    'showPoweredBy' => (bool)$tenant['show_powered_by'],
    'cities' => $cities,
    'shifts' => $shifts,
    'useShifts' => ($settings['use_shifts'] ?? '0') === '1',
    'texts' => $texts,
    'primaryColor' => $settings['primary_color'] ?? null,
    'secondaryColor' => $settings['secondary_color'] ?? null,
    'fontFamily' => $settings['font_family'] ?? null,
];

require_once __DIR__ . '/../../lib/response.php';
Response::ok($config);
