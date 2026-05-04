<?php
// =====================================================================
// env.php — טעינת משתני סביבה מקובץ .env
// פשוט, ללא תלויות חיצוניות (Hostinger Shared אין composer).
// =====================================================================
declare(strict_types=1);

class Env {
    private static array $vars = [];
    private static bool $loaded = false;

    public static function load(string $path): void {
        if (self::$loaded) return;
        self::$loaded = true;

        if (!file_exists($path)) return;

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) continue;
            if (!str_contains($line, '=')) continue;

            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            // הסרת מירכאות סביב הערך
            if (strlen($value) >= 2) {
                $first = $value[0];
                $last = $value[strlen($value) - 1];
                if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                    $value = substr($value, 1, -1);
                }
            }

            self::$vars[$key] = $value;
        }
    }

    public static function get(string $key, ?string $default = null): ?string {
        return self::$vars[$key] ?? $_ENV[$key] ?? getenv($key) ?: $default;
    }

    public static function require(string $key): string {
        $val = self::get($key);
        if ($val === null || $val === '') {
            throw new RuntimeException("Missing required env var: $key");
        }
        return $val;
    }
}

// טוען אוטומטית את .env מתיקיית ה-backend (אחת מעל לprefix של lib/).
Env::load(__DIR__ . '/../.env');
