<?php
// =====================================================================
// bootstrap.php — חייב להיות require_once בראש כל endpoint.
// טוען env, CORS, error handling, ומכין את הסביבה.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/env.php';
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/cors.php';

// Error handling — אין trace בפרודקשן.
$debug = Env::get('APP_DEBUG', '0') === '1';
ini_set('display_errors', $debug ? '1' : '0');
error_reporting(E_ALL);

set_exception_handler(function (Throwable $e) use ($debug) {
    error_log('Uncaught: ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    $msg = $debug ? $e->getMessage() : 'Internal server error';
    Response::error($msg, 500, 'server_error');
});

send_cors_headers();
