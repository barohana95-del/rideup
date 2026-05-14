<?php
// =====================================================================
// auth.php — auth resolver.
//
// Resolution order:
//   1. JWT in `rideup_jwt` cookie (real Google OAuth flow)
//   2. JWT in `Authorization: Bearer ...` header
//   3. `X-Mock-User-Id` header (dev only — falls through if APP_ENV=production)
//   4. ?_user=<id> query param (dev only)
//
// On Hostinger Shared with the demo user, mock still works — useful
// for testing without going through Google every time.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/jwt.php';

class Auth {
    private static ?array $current = null;
    private static bool $resolved = false;

    public static function current(): ?array {
        if (self::$resolved) return self::$current;
        self::$resolved = true;

        $userId = self::extractUserId();
        if ($userId === null) return null;

        // Auto-seed demo user (id=1) so dev access works
        if ($userId === 1) self::ensureDemoUser();

        $user = DB::one('SELECT * FROM users WHERE id = ?', [$userId]);
        self::$current = $user;
        return $user;
    }

    public static function require(): array {
        $user = self::current();
        if ($user === null) Response::unauthorized('Login required');
        return $user;
    }

    public static function id(): ?int {
        $u = self::current();
        return $u === null ? null : (int) $u['id'];
    }

    public static function requireAdmin(): array {
        $user = self::require();
        if ((int) $user['is_admin'] !== 1) {
            Response::forbidden('Admin only');
        }
        return $user;
    }

    private static function extractUserId(): ?int {
        // 1. JWT cookie
        if (!empty($_COOKIE['rideup_jwt'])) {
            $payload = self::tryJwt($_COOKIE['rideup_jwt']);
            if ($payload !== null) return (int) $payload['sub'];
        }

        // 2. Authorization: Bearer
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        foreach ($headers as $key => $val) {
            if (strcasecmp($key, 'Authorization') === 0 && stripos($val, 'Bearer ') === 0) {
                $token = trim(substr($val, 7));
                if ($token !== '') {
                    $payload = self::tryJwt($token);
                    if ($payload !== null) return (int) $payload['sub'];
                }
            }
        }

        // 3. Mock header (dev only — refuse in production)
        if (Env::get('APP_ENV', 'dev') !== 'production') {
            foreach ($headers as $key => $val) {
                if (strcasecmp($key, 'X-Mock-User-Id') === 0) {
                    $id = (int) $val;
                    return $id > 0 ? $id : null;
                }
            }
        }

        // 4. Dev query override
        if (Env::get('APP_DEBUG', '0') === '1' && isset($_GET['_user'])) {
            $id = (int) $_GET['_user'];
            return $id > 0 ? $id : null;
        }

        return null;
    }

    private static function tryJwt(string $token): ?array {
        try {
            return Jwt::decode($token);
        } catch (Throwable $e) {
            error_log('JWT decode failed: ' . $e->getMessage());
            return null;
        }
    }

    private static function ensureDemoUser(): void {
        $exists = DB::one('SELECT id, is_admin FROM users WHERE id = 1');
        if ($exists) {
            if ((int) $exists['is_admin'] !== 1) {
                DB::exec("UPDATE users SET is_admin = 1 WHERE id = 1");
            }
            return;
        }
        DB::exec(
            "INSERT IGNORE INTO users (id, google_id, email, display_name, avatar_url, is_admin)
             VALUES (1, 'demo_google_id', 'demo@rideup.co.il', 'משתמש דמו', NULL, 1)"
        );
    }
}

// =====================================================================
// TenantAccess — resolves whether the current user can touch a tenant.
//
//   $ctx = TenantAccess::require($slug, $user);              // any role
//   $ctx = TenantAccess::require($slug, $user, 'editor');    // editor+
//   $ctx = TenantAccess::require($slug, $user, 'owner');     // owner only
//
// Returns: ['tenant' => <full row>, 'role' => 'owner'|'editor'|'viewer']
// On failure: emits 404 (tenant missing) or 403 (no access).
//
// Roles:
//   - owner   = tenants.owner_user_id matches, OR is_admin=1 (super-admin
//               bypass — platform owner can manage any tenant).
//   - editor  = accepted tenant_collaborators row with role='editor'.
//   - viewer  = accepted tenant_collaborators row with role='viewer'.
// =====================================================================
class TenantAccess {
    private const RANK = ['viewer' => 1, 'editor' => 2, 'owner' => 3];

    public static function require(string $slug, array $user, string $minRole = 'viewer'): array {
        $slug = strtolower(trim($slug));
        if ($slug === '') Response::error('slug required', 400);

        $tenant = DB::one(
            "SELECT * FROM tenants WHERE slug = ? AND status != 'deleted'",
            [$slug]
        );
        if ($tenant === null) Response::notFound('Tenant not found');

        $role = self::roleFor($tenant, $user);
        if ($role === null) Response::forbidden('No access to this tenant');

        if (self::RANK[$role] < self::RANK[$minRole]) {
            Response::forbidden('Insufficient permissions');
        }

        return ['tenant' => $tenant, 'role' => $role];
    }

    public static function roleFor(array $tenant, array $user): ?string {
        $uid = (int) $user['id'];
        // Owner of the tenant
        if ((int) $tenant['owner_user_id'] === $uid) return 'owner';
        // Platform admin acts as owner
        if ((int) ($user['is_admin'] ?? 0) === 1) return 'owner';
        // Accepted collaborator
        $row = DB::one(
            "SELECT role FROM tenant_collaborators
             WHERE tenant_id = ? AND user_id = ? AND accepted_at IS NOT NULL",
            [(int) $tenant['id'], $uid]
        );
        if ($row && in_array($row['role'], ['owner', 'editor', 'viewer'], true)) {
            return (string) $row['role'];
        }
        return null;
    }
}
