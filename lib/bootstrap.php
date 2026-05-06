<?php
// =====================================================================
// bootstrap.php — must be require_once'd at the top of every endpoint.
// Loads env, CORS, and error handling.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/env.php';
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/cors.php';

/**
 * Treat the request as "dev" when either:
 *   - APP_DEBUG=1 in .env, or
 *   - The request carries the X-Mock-User-Id header (means we're in
 *     mock-auth mode, which only happens in dev).
 *
 * In dev, uncaught errors are reported in full to the client so we can
 * actually debug. In prod, only a generic "Internal server error".
 */
function rideup_is_dev(): bool {
    if (Env::get('APP_DEBUG', '0') === '1') return true;
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    foreach ($headers as $key => $val) {
        if (strcasecmp($key, 'X-Mock-User-Id') === 0 && $val !== '') return true;
    }
    return false;
}

$debug = rideup_is_dev();
ini_set('display_errors', $debug ? '1' : '0');
error_reporting(E_ALL);

set_exception_handler(function (Throwable $e) use ($debug) {
    $where = $e->getFile() . ':' . $e->getLine();
    error_log('Uncaught: ' . $e->getMessage() . ' @ ' . $where);

    if ($debug) {
        // Send the real error + stack so the dev can fix it.
        Response::json([
            'success' => false,
            'error'   => $e->getMessage(),
            'code'    => 'server_error',
            'where'   => $where,
            'trace'   => array_slice(explode("\n", $e->getTraceAsString()), 0, 6),
        ], 500);
    }
    Response::error('Internal server error', 500, 'server_error');
});

send_cors_headers();
