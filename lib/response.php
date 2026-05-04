<?php
// =====================================================================
// response.php — תשובות JSON אחידות.
// כל endpoint צריך לסיים ב-Response::ok(...) או Response::error(...).
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
}

/**
 * קורא ומפרש JSON body של בקשה.
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
