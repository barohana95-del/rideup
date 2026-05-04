<?php
// =====================================================================
// cors.php — CORS headers לפיתוח (frontend מקומי, backend על Hostinger).
// בפרודקשן: רק אותו דומיין.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/env.php';

function send_cors_headers(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = explode(',', Env::get('CORS_ORIGINS', 'http://localhost:3000') ?? '');
    $allowed = array_map('trim', $allowed);

    if (in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Vary: Origin');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
