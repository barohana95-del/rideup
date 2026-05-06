<?php
// =====================================================================
// PATCH /api/admin/update-tenant.php?slug=foo
// Body: any subset of:
//   {
//     slug, theme, eventTitle, eventDate, eventTime, eventLocation,
//     primaryColor, secondaryColor, fontFamily, logoUrl, coverImageUrl,
//     invitationText, instructionsText, thankYouText, useShifts
//   }
// Updates: tenants row + tenant_settings rows.
// Returns: updated tenant config (same shape as /admin/tenant.php).
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::require();
$slug = strtolower(trim($_GET['slug'] ?? ''));
if ($slug === '') Response::error('slug required', 400);

$tenant = DB::one(
    "SELECT * FROM tenants WHERE slug = ? AND status != 'deleted'",
    [$slug]
);
if ($tenant === null) Response::notFound('Tenant not found');
if ((int) $tenant['owner_user_id'] !== (int) $user['id']) {
    Response::forbidden('You do not own this tenant');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'PATCH' && $method !== 'POST') {
    Response::error('Method not allowed', 405);
}

$body = read_json_body();
$tenantId = (int) $tenant['id'];
$pdo = DB::pdo();

// ── Field whitelists ─────────────────────────────────────────────────
// 1. Columns updatable directly on `tenants`
$tenantColumnMap = [
    'theme'         => 'theme',
    'eventTitle'    => 'event_title',
    'eventDate'     => 'event_date',
    'eventTime'     => 'event_time',
    'eventLocation' => 'event_location',
    'logoUrl'       => 'logo_url',
    'coverImageUrl' => 'cover_image_url',
];
$themeAllowed     = ['classic', 'modern', 'rustic', 'festive'];
$fontAllowed      = ['Heebo', 'Shikma', 'Frank Ruhl Libre', 'Assistant'];

// 2. tenant_settings keys
$settingMap = [
    'primaryColor'     => 'primary_color',
    'secondaryColor'   => 'secondary_color',
    'fontFamily'       => 'font_family',
    'invitationText'   => 'invitation_text',
    'instructionsText' => 'instructions_text',
    'thankYouText'     => 'thank_you_text',
    'useShifts'        => 'use_shifts',
];

// ── Validate slug change (most sensitive) ────────────────────────────
$newSlug = null;
if (isset($body['slug']) && is_string($body['slug'])) {
    $newSlug = strtolower(trim($body['slug']));
    if ($newSlug !== $slug) {
        if (!preg_match('/^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/', $newSlug)) {
            Response::error('Invalid slug format', 400, 'bad_slug');
        }
        $reserved = DB::one('SELECT slug FROM reserved_slugs WHERE slug = ?', [$newSlug]);
        if ($reserved) Response::error('Slug is reserved', 409, 'slug_reserved');

        $taken = DB::one(
            "SELECT id FROM tenants WHERE slug = ? AND id != ? AND status != 'deleted'",
            [$newSlug, $tenantId]
        );
        if ($taken) Response::error('Slug already taken', 409, 'slug_taken');
    } else {
        $newSlug = null; // unchanged, skip
    }
}

// ── Validate theme/font/colors ───────────────────────────────────────
if (isset($body['theme']) && !in_array($body['theme'], $themeAllowed, true)) {
    Response::error('Invalid theme', 400, 'bad_theme');
}
if (isset($body['fontFamily']) && $body['fontFamily'] !== null
    && !in_array($body['fontFamily'], $fontAllowed, true)) {
    Response::error('Invalid font', 400, 'bad_font');
}
foreach (['primaryColor', 'secondaryColor'] as $colorKey) {
    if (isset($body[$colorKey]) && $body[$colorKey] !== null && $body[$colorKey] !== '') {
        if (!preg_match('/^#[0-9a-fA-F]{6}$/', $body[$colorKey])) {
            Response::error("Invalid $colorKey (expected #RRGGBB)", 400);
        }
    }
}

// ── Apply updates in a transaction ───────────────────────────────────
$pdo->beginTransaction();
try {
    // 1. tenants row
    $sets = [];
    $params = [];
    foreach ($tenantColumnMap as $bodyKey => $col) {
        if (array_key_exists($bodyKey, $body)) {
            $sets[] = "`$col` = ?";
            $val = $body[$bodyKey];
            $params[] = $val === '' ? null : $val;
        }
    }
    if ($newSlug !== null) {
        $sets[] = '`slug` = ?';
        $params[] = $newSlug;
    }
    if (!empty($sets)) {
        $params[] = $tenantId;
        DB::exec("UPDATE tenants SET " . implode(', ', $sets) . ", updated_at = NOW() WHERE id = ?", $params);
    }

    // 2. tenant_settings
    foreach ($settingMap as $bodyKey => $key) {
        if (!array_key_exists($bodyKey, $body)) continue;
        $val = $body[$bodyKey];
        if (is_bool($val)) $val = $val ? '1' : '0';
        if ($val === null) {
            DB::exec("DELETE FROM tenant_settings WHERE tenant_id = ? AND `key` = ?", [$tenantId, $key]);
        } else {
            DB::exec(
                "INSERT INTO tenant_settings (tenant_id, `key`, `value`)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
                [$tenantId, $key, (string) $val]
            );
        }
    }

    // 3. audit log
    $changes = array_keys($body);
    DB::exec(
        "INSERT INTO audit_log (tenant_id, actor_user_id, action, entity_type, entity_id, metadata, ip)
         VALUES (?, ?, ?, 'tenant', ?, ?, ?)",
        [
            $tenantId,
            (int) $user['id'],
            $newSlug !== null ? 'tenant.slug_changed' : 'tenant.updated',
            $tenantId,
            json_encode(['changed' => $changes, 'old_slug' => $newSlug !== null ? $slug : null], JSON_UNESCAPED_UNICODE),
            $_SERVER['REMOTE_ADDR'] ?? null,
        ]
    );

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    error_log('update-tenant failed: ' . $e->getMessage());
    Response::error('Update failed: ' . $e->getMessage(), 500, 'update_failed');
}

// ── Return refreshed view (same shape as /admin/tenant.php) ──────────
$finalSlug = $newSlug ?? $slug;
$updated = DB::one('SELECT * FROM tenants WHERE id = ?', [$tenantId]);
$cities  = DB::all("SELECT id, name, display_order FROM tenant_cities WHERE tenant_id = ? ORDER BY display_order, id", [$tenantId]);
$shifts  = DB::all("SELECT id, time_label, display_order FROM tenant_shifts WHERE tenant_id = ? ORDER BY display_order, id", [$tenantId]);
$rows    = DB::all("SELECT `key`, `value` FROM tenant_settings WHERE tenant_id = ?", [$tenantId]);
$settings = [];
foreach ($rows as $r) $settings[$r['key']] = $r['value'];

Response::ok([
    'tenant'   => $updated,
    'cities'   => $cities,
    'shifts'   => $shifts,
    'settings' => $settings,
    'newSlug'  => $finalSlug,
]);
