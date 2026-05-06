<?php
// =====================================================================
// response.php — uniform JSON responses.
// Every endpoint should finish with Response::ok(...) or Response::error(...).
//
// Response::ok() automatically converts snake_case keys → camelCase
// recursively before sending, so the React frontend's TypeScript types
// (camelCase) match the JSON it receives from PHP (which queries DB
// columns in snake_case).
// =====================================================================
declare(strict_types=1);

class Response {
    public static function json(array $payload, int $status = 200): never {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function ok(mixed $data = null): never {
        self::json(['success' => true, 'data' => self::camelize($data)]);
    }

    /**
     * Send the data without auto-camelization. Use this for endpoints
     * that intentionally return mixed/legacy keys (rare).
     */
    public static function okRaw(mixed $data = null): never {
        self::json(['success' => true, 'data' => $data]);
    }

    public static function error(string $message, int $status = 400, ?string $code = null): never {
        $payload = ['success' => false, 'error' => $message];
        if ($code !== null) $payload['code'] = $code;
        self::json($payload, $status);
    }

    public static function notFound(string $message = 'Not found'): never {
        self::error($message, 404, 'not_found');
    }

    public static function unauthorized(string $message = 'Unauthorized'): never {
        self::error($message, 401, 'unauthorized');
    }

    public static function forbidden(string $message = 'Forbidden'): never {
        self::error($message, 403, 'forbidden');
    }

    /**
     * Recursively converts associative-array keys snake_case → camelCase.
     * Lists (numeric keys) are walked but their structure preserved.
     * Scalars and non-arrays are returned untouched.
     */
    private static function camelize(mixed $value): mixed {
        if (!is_array($value)) return $value;

        // List (numeric keys) — walk children, keep order.
        if (array_is_list($value)) {
            return array_map([self::class, 'camelize'], $value);
        }

        // Associative — convert each key.
        $out = [];
        foreach ($value as $k => $v) {
            $newKey = is_string($k) ? self::snakeToCamel($k) : $k;
            $out[$newKey] = self::camelize($v);
        }
        return $out;
    }

    private static function snakeToCamel(string $key): string {
        if (!str_contains($key, '_')) return $key;
        // Split, lowercase first part, ucfirst the rest, join.
        $parts = explode('_', $key);
        $first = array_shift($parts);
        return $first . implode('', array_map('ucfirst', $parts));
    }
}

/**
 * Reads + parses the JSON body of the request.
 */
function read_json_body(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return [];
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        Response::error('Invalid JSON body', 400, 'bad_json');
    }
    return $decoded;
}
