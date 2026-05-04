<?php
// =====================================================================
// tenant.php — חילוץ tenant מה-Host (subdomain).
//
// כללי:
//   {BASE_DOMAIN}              → no tenant (marketing/app)
//   app.{BASE_DOMAIN}          → no tenant (admin shell)
//   {slug}.{BASE_DOMAIN}       → tenant!
//   reserved subdomains        → no tenant
//
// קונפיגורציה:
//   BASE_DOMAIN   — דומיין בסיסי (ב-.env). למשל "rideup.co.il" או
//                    "dev.rideup.co.il" בסביבת פיתוח.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/env.php';
require_once __DIR__ . '/db.php';

class Tenant {
    private static ?array $current = null;
    private static bool $resolved = false;

    private const RESERVED = [
        'www', 'app', 'api', 'admin', 'mail', 'blog', 'docs', 'help',
        'support', 'billing', 'checkout', 'login', 'signup', 'about',
        'pricing', 'terms', 'privacy', 'rideup', 'dev', 'staging', 'test',
    ];

    /**
     * מזהה את ה-tenant הנוכחי לפי ה-Host header.
     * מחזיר את הרשומה מה-DB, או null אם אין tenant.
     * אם slug קיים אבל לא נמצא ב-DB → 404.
     */
    public static function current(): ?array {
        if (self::$resolved) return self::$current;
        self::$resolved = true;

        $slug = self::extractSlugFromHost();
        if ($slug === null) return null;

        $tenant = DB::one(
            "SELECT * FROM tenants WHERE slug = ? LIMIT 1",
            [$slug]
        );

        if ($tenant === null) {
            require_once __DIR__ . '/response.php';
            Response::notFound("Tenant '$slug' not found");
        }

        // בדיקת סטטוס — אם מחוק / מושעה, לא מחזירים.
        if (in_array($tenant['status'], ['deleted', 'suspended'], true)) {
            require_once __DIR__ . '/response.php';
            Response::notFound("Tenant unavailable");
        }

        self::$current = $tenant;
        return $tenant;
    }

    public static function id(): ?int {
        $t = self::current();
        return $t === null ? null : (int) $t['id'];
    }

    public static function require(): array {
        $t = self::current();
        if ($t === null) {
            require_once __DIR__ . '/response.php';
            Response::error('Tenant context required', 400, 'no_tenant');
        }
        return $t;
    }

    /**
     * פענוח slug מה-Host header.
     * מחזיר null אם זה ה-base domain עצמו, app, או reserved.
     */
    private static function extractSlugFromHost(): ?string {
        $host = self::host();
        $base = Env::get('BASE_DOMAIN', 'localhost');

        // dev override: ?tenant=foo בשורת ה-URL
        if (isset($_GET['tenant']) && is_string($_GET['tenant'])) {
            return self::sanitizeSlug($_GET['tenant']);
        }

        // localhost / 127.0.0.1 → no tenant (אלא אם override)
        if ($host === 'localhost' || $host === '127.0.0.1') return null;

        // ה-base domain עצמו → no tenant
        if ($host === $base) return null;

        // {sub}.{base}
        $suffix = '.' . $base;
        if (str_ends_with($host, $suffix)) {
            $sub = substr($host, 0, -strlen($suffix));
            // רק רמה אחת
            if (str_contains($sub, '.')) return null;
            if (in_array($sub, self::RESERVED, true)) return null;
            return self::sanitizeSlug($sub);
        }

        return null;
    }

    private static function host(): string {
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        // הסרת port אם יש
        if (str_contains($host, ':')) {
            $host = explode(':', $host)[0];
        }
        return strtolower($host);
    }

    private static function sanitizeSlug(string $s): string {
        $s = strtolower(trim($s));
        if (!preg_match('/^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/', $s)) {
            require_once __DIR__ . '/response.php';
            Response::error('Invalid slug', 400, 'bad_slug');
        }
        return $s;
    }
}
