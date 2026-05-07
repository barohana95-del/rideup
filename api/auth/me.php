<?php
// =====================================================================
// GET /api/auth/me.php
// Returns the currently authenticated user (from JWT cookie or header).
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$user = Auth::current();
if ($user === null) Response::unauthorized('Not logged in');

Response::ok([
    'id'          => (int) $user['id'],
    'email'       => $user['email'],
    'displayName' => $user['display_name'],
    'avatarUrl'   => $user['avatar_url'],
    'isAdmin'     => (int) $user['is_admin'] === 1,
]);
