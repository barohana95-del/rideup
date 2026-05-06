<?php
// =====================================================================
// tenant.php — extracts the active tenant from the request.
//
// Path-based architecture: the frontend uses paths like /<slug>,
// but every API call passes the slug explicitly via `?tenant=<slug>`.
// This class reads that query parameter, validates it, and loads the row.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/env.php';
require_once __DIR__ . '/db.php';

class Tenant {
    private static ?array $current = null;
    private static bool $resolved = false;

    /**
     * Returns the current tenant or null if no `?tenant=` was supplied.
     * Throws 404 if the slug doesn't exist or the tenant is deleted/suspended.
     */
    public static function current(): ?array {
        if (self::$resolved) return self::$current;
        self::$resolved = true;

        $slug = self::extractSlug();
        if ($slug === null) return null;

        $tenant = DB::one(
            "SELECT * FROM tenants WHERE slug = ? LIMIT 1",
            [$slug]
        );

        if ($tenant === null) {
            require_once __DIR__ . '/response.php';
            Response::notFound("Tenant '$slug' not found");
        }

        if (in_array($tenant['status'], ['deleted', 'suspended'], true)) {
            require_once __DIR__ . '/response.php';
            Response::notFound('Tenant unavailable');
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
     * Extracts the slug from the request, in priority order:
     *   1. ?tenant=<slug> query param (used by all API clients)
     *   2. POST/PATCH JSON body field "slug" (used by admin/public writes)
     *
     * Host-based extraction has been removed — RideUp uses path-based
     * tenancy and API endpoints always carry slug as a parameter.
     */
    private static function extractSlug(): ?string {
        if (isset($_GET['tenant']) && is_string($_GET['tenant']) && $_GET['tenant'] !== '') {
            return self::sanitizeSlug($_GET['tenant']);
        }
        return null;
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
