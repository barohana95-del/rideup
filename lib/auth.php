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
