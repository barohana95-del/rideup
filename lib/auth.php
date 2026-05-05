<?php
// =====================================================================
// auth.php — mock auth helper.
// Reads `X-Mock-User-Id` header from request. If user doesn't exist in
// `users` table, auto-seeds the demo user (id=1).
// Will be replaced with JWT-based Google OAuth in Stage 2.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/response.php';

class Auth {
    private static ?array $current = null;
    private static bool $resolved = false;

    /**
     * Get the current user. Returns null if no auth header.
     */
    public static function current(): ?array {
        if (self::$resolved) return self::$current;
        self::$resolved = true;

        $userId = self::extractUserId();
        if ($userId === null) return null;

        // Auto-seed demo user (id=1)
        if ($userId === 1) {
            self::ensureDemoUser();
        }

        $user = DB::one('SELECT * FROM users WHERE id = ?', [$userId]);
        self::$current = $user;
        return $user;
    }

    public static function require(): array {
        $user = self::current();
        if ($user === null) {
            Response::unauthorized('Login required');
        }
        return $user;
    }

    public static function id(): ?int {
        $u = self::current();
        return $u === null ? null : (int) $u['id'];
    }

    private static function extractUserId(): ?int {
        // 1) X-Mock-User-Id header (dev)
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        foreach ($headers as $key => $val) {
            if (strcasecmp($key, 'X-Mock-User-Id') === 0) {
                $id = (int) $val;
                return $id > 0 ? $id : null;
            }
        }
        // 2) Fallback: ?_user query param (dev only when debug)
        if (Env::get('APP_DEBUG', '0') === '1' && isset($_GET['_user'])) {
            $id = (int) $_GET['_user'];
            return $id > 0 ? $id : null;
        }
        return null;
    }

    private static function ensureDemoUser(): void {
        $exists = DB::one('SELECT id FROM users WHERE id = 1');
        if ($exists) return;

        DB::exec(
            "INSERT IGNORE INTO users (id, google_id, email, display_name, avatar_url, is_admin)
             VALUES (1, 'demo_google_id', 'demo@rideup.co.il', 'משתמש דמו', NULL, 0)"
        );
    }
}
