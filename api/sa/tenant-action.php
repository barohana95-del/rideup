<?php
// =====================================================================
// POST /api/sa/tenant-action.php
// Body: { tenantId, action, value? }
//
// Actions:
//   change_plan      → value: 'trial' | 'basic' | 'pro' | 'premium'
//   change_status    → value: 'trial' | 'active' | 'expired' | 'archived' | 'suspended'
//   extend_trial     → value: days (int, default 14)
//   extend_access    → value: days (int, default 30)
//   delete           → soft-delete (status='deleted')
//   make_admin       → value: bool, sets is_admin on the owner user
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$admin = Auth::requireAdmin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Response::error('Method not allowed', 405);
}

$body = read_json_body();
$tenantId = (int) ($body['tenantId'] ?? 0);
$action   = (string) ($body['action'] ?? '');
$value    = $body['value'] ?? null;

if ($tenantId <= 0) Response::error('tenantId required', 400);

$tenant = DB::one('SELECT * FROM tenants WHERE id = ?', [$tenantId]);
if ($tenant === null) Response::notFound('Tenant not found');

switch ($action) {
    case 'change_plan': {
        $allowed = ['trial', 'basic', 'pro', 'premium'];
        if (!in_array($value, $allowed, true)) Response::error('Invalid plan', 400);
        DB::exec("UPDATE tenants SET plan = ?, updated_at = NOW() WHERE id = ?", [$value, $tenantId]);
        break;
    }

    case 'change_status': {
        $allowed = ['draft', 'trial', 'active', 'expired', 'archived', 'suspended'];
        if (!in_array($value, $allowed, true)) Response::error('Invalid status', 400);
        DB::exec("UPDATE tenants SET status = ?, updated_at = NOW() WHERE id = ?", [$value, $tenantId]);
        break;
    }

    case 'extend_trial': {
        $days = (int) ($value ?? 14);
        if ($days < 1 || $days > 365) Response::error('Days must be 1-365', 400);
        $current = $tenant['trial_ends_at'] ?? null;
        $base = ($current && strtotime($current) > time()) ? strtotime($current) : time();
        $newEnd = date('Y-m-d H:i:s', $base + $days * 86400);
        DB::exec(
            "UPDATE tenants SET trial_ends_at = ?, status = 'trial', updated_at = NOW() WHERE id = ?",
            [$newEnd, $tenantId]
        );
        break;
    }

    case 'extend_access': {
        $days = (int) ($value ?? 30);
        if ($days < 1 || $days > 730) Response::error('Days must be 1-730', 400);
        $current = $tenant['paid_until'] ?? null;
        $base = ($current && strtotime($current) > time()) ? strtotime($current) : time();
        $newEnd = date('Y-m-d H:i:s', $base + $days * 86400);
        DB::exec(
            "UPDATE tenants SET paid_until = ?, status = 'active', updated_at = NOW() WHERE id = ?",
            [$newEnd, $tenantId]
        );
        break;
    }

    case 'delete': {
        DB::exec("UPDATE tenants SET status = 'deleted', updated_at = NOW() WHERE id = ?", [$tenantId]);
        break;
    }

    case 'make_admin': {
        $isAdmin = !empty($value) ? 1 : 0;
        DB::exec("UPDATE users SET is_admin = ? WHERE id = ?", [$isAdmin, (int) $tenant['owner_user_id']]);
        break;
    }

    default:
        Response::error('Unknown action: ' . $action, 400, 'bad_action');
}

// Audit
DB::exec(
    "INSERT INTO audit_log (tenant_id, actor_user_id, action, entity_type, entity_id, metadata, ip)
     VALUES (?, ?, ?, 'tenant', ?, ?, ?)",
    [
        $tenantId,
        (int) $admin['id'],
        'sa.' . $action,
        $tenantId,
        json_encode(['value' => $value], JSON_UNESCAPED_UNICODE),
        $_SERVER['REMOTE_ADDR'] ?? null,
    ]
);

$updated = DB::one('SELECT * FROM tenants WHERE id = ?', [$tenantId]);
Response::ok($updated);
