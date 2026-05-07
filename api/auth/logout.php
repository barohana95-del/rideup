<?php
// =====================================================================
// POST /api/auth/logout.php
// Clears the JWT cookie.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';

setcookie('rideup_jwt', '', [
    'expires'  => time() - 3600,
    'path'     => '/',
    'secure'   => ($_SERVER['HTTPS'] ?? '') === 'on',
    'httponly' => true,
    'samesite' => 'Lax',
]);

Response::ok(['loggedOut' => true]);
