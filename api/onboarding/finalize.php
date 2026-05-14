<?php
// =====================================================================
// POST /api/onboarding/finalize.php
// Body: { plan, slug, theme, eventType, eventTitle, eventDate, eventTime,
//         eventLocation, cities, useShifts, shifts, texts: {...} }
// Creates: tenant + tenant_cities + tenant_shifts + tenant_settings.
// Returns: { tenant: {...} }
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Response::error('Method not allowed', 405);
}

$user = Auth::require();
$body = read_json_body();

// --- Validate ---
$slug = strtolower(trim($body['slug'] ?? ''));
if (!preg_match('/^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/', $slug)) {
    Response::error('Invalid slug', 400, 'bad_slug');
}

$plan = $body['plan'] ?? '';
if (!in_array($plan, ['trial', 'basic', 'pro', 'premium'], true)) {
    Response::error('Invalid plan', 400, 'bad_plan');
}

$theme = $body['theme'] ?? '';
if (!in_array($theme, ['classic', 'modern', 'rustic', 'festive'], true)) {
    Response::error('Invalid theme', 400, 'bad_theme');
}

$eventType = $body['eventType'] ?? '';
if (!in_array($eventType, ['wedding', 'bar_mitzvah', 'bat_mitzvah', 'birthday', 'corporate', 'other'], true)) {
    Response::error('Invalid event type', 400, 'bad_event_type');
}

$eventTitle = trim((string)($body['eventTitle'] ?? ''));
$eventDate  = trim((string)($body['eventDate'] ?? ''));
$eventTime  = trim((string)($body['eventTime'] ?? ''));
$eventLoc   = trim((string)($body['eventLocation'] ?? ''));
$cities     = $body['cities'] ?? [];
$useShifts  = (bool)($body['useShifts'] ?? false);
$shifts     = $body['shifts'] ?? [];
$texts      = $body['texts'] ?? [];

if ($eventTitle === '')           Response::error('Event title required', 400);
if ($eventDate === '')            Response::error('Event date required', 400);
if (!is_array($cities) || count($cities) < 1) Response::error('At least one city required', 400);

// --- Check slug availability ---
$reserved = DB::one('SELECT slug FROM reserved_slugs WHERE slug = ?', [$slug]);
if ($reserved) Response::error('Slug is reserved', 409, 'slug_reserved');

$existing = DB::one(
    "SELECT id FROM tenants WHERE slug = ? AND status NOT IN ('deleted')",
    [$slug]
);
if ($existing) Response::error('Slug already taken', 409, 'slug_taken');

// --- Create tenant + related rows in a transaction ---
$pdo = DB::pdo();
$pdo->beginTransaction();

try {
    // 1) tenants
    $trialEndsAt = $plan === 'trial'
        ? date('Y-m-d H:i:s', strtotime('+14 days'))
        : null;
    $paidUntil = $plan !== 'trial'
        ? date('Y-m-d H:i:s', strtotime('+90 days'))
        : null;

    $tenantId = DB::insert(
        "INSERT INTO tenants
         (slug, owner_user_id, status, plan, theme, event_type, event_title,
          event_date, event_time, event_location, trial_started_at, trial_ends_at, paid_until)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)",
        [
            $slug,
            (int) $user['id'],
            $plan === 'trial' ? 'trial' : 'active',
            $plan,
            $theme,
            $eventType,
            $eventTitle,
            $eventDate,
            $eventTime !== '' ? $eventTime : null,
            $eventLoc !== '' ? $eventLoc : null,
            $trialEndsAt,
            $paidUntil,
        ]
    );

    // 1b) Register the creating user as the owner-collaborator.
    // Safe if the table doesn't exist yet (older deployments).
    try {
        DB::exec(
            "INSERT IGNORE INTO tenant_collaborators
             (tenant_id, user_id, role, invited_by, accepted_at)
             VALUES (?, ?, 'owner', ?, NOW())",
            [$tenantId, (int) $user['id'], (int) $user['id']]
        );
    } catch (Throwable $e) {
        error_log('Could not seed owner collaborator: ' . $e->getMessage());
    }

    // 2) cities
    $order = 0;
    foreach ($cities as $city) {
        $name = trim((string) $city);
        if ($name === '') continue;
        DB::exec(
            "INSERT INTO tenant_cities (tenant_id, name, display_order) VALUES (?, ?, ?)",
            [$tenantId, $name, $order++]
        );
    }

    // 3) shifts
    if ($useShifts) {
        $order = 0;
        foreach ($shifts as $label) {
            $s = trim((string) $label);
            if ($s === '') continue;
            DB::exec(
                "INSERT INTO tenant_shifts (tenant_id, time_label, display_order) VALUES (?, ?, ?)",
                [$tenantId, $s, $order++]
            );
        }
    }

    // 4) settings
    $settings = [
        'use_shifts'        => $useShifts ? '1' : '0',
        'invitation_text'   => trim((string)($texts['invitationText'] ?? '')),
        'instructions_text' => trim((string)($texts['instructionsText'] ?? '')),
        'thank_you_text'    => trim((string)($texts['thankYouText'] ?? '')),
    ];
    foreach ($settings as $key => $val) {
        DB::exec(
            "INSERT INTO tenant_settings (tenant_id, `key`, `value`) VALUES (?, ?, ?)",
            [$tenantId, $key, $val]
        );
    }

    // 5) audit log
    DB::exec(
        "INSERT INTO audit_log (tenant_id, actor_user_id, action, entity_type, entity_id, ip)
         VALUES (?, ?, 'tenant.created', 'tenant', ?, ?)",
        [$tenantId, (int) $user['id'], $tenantId, $_SERVER['REMOTE_ADDR'] ?? null]
    );

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    error_log('finalize.php failed: ' . $e->getMessage());
    Response::error('Failed to create tenant', 500, 'create_failed');
}

// --- Return the new tenant ---
$tenant = DB::one('SELECT * FROM tenants WHERE id = ?', [$tenantId]);
Response::ok($tenant);
