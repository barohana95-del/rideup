<?php
// =====================================================================
// POST /api/auth/google.php
// Body: { idToken: string }
//
// Verifies Google ID token via Google's tokeninfo endpoint, creates or
// updates the user, issues a 7-day JWT, sets it as an httpOnly cookie,
// and also returns it in the body (for clients that prefer header auth).
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';
require_once __DIR__ . '/../../lib/jwt.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Response::error('Method not allowed', 405);
}

$body    = read_json_body();
$idToken = trim((string)($body['idToken'] ?? ''));
if ($idToken === '') Response::error('idToken required', 400);

// 1. Verify the ID token with Google.
$ch = curl_init('https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken));
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$raw  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200 || !is_string($raw)) {
    Response::error('Failed to reach Google verification', 502, 'verify_unreachable');
}

$claims = json_decode($raw, true);
if (!is_array($claims)) Response::error('Invalid Google response', 502);

if (isset($claims['error_description']) || isset($claims['error'])) {
    Response::error('Google rejected the token', 401, 'invalid_token');
}

// 2. Validate aud claim matches our Client ID.
$expectedAud = Env::get('GOOGLE_CLIENT_ID', '');
if ($expectedAud === '') {
    Response::error('GOOGLE_CLIENT_ID not configured on server', 500, 'no_client_id');
}
if (($claims['aud'] ?? '') !== $expectedAud) {
    Response::error('Token audience mismatch', 401, 'aud_mismatch');
}

// 3. Validate issuer.
$iss = $claims['iss'] ?? '';
if ($iss !== 'accounts.google.com' && $iss !== 'https://accounts.google.com') {
    Response::error('Bad issuer', 401, 'bad_iss');
}

// 4. Optional: require verified email.
if (($claims['email_verified'] ?? 'false') !== 'true' && ($claims['email_verified'] ?? false) !== true) {
    Response::error('Email not verified by Google', 401, 'email_unverified');
}

$googleId  = (string)($claims['sub']    ?? '');
$email     = strtolower((string)($claims['email']  ?? ''));
$name      = (string)($claims['name']   ?? '');
$avatarUrl = (string)($claims['picture'] ?? '');

if ($googleId === '' || $email === '') Response::error('Missing identity', 401);

// 5. Upsert user.
$existing = DB::one('SELECT * FROM users WHERE google_id = ? OR email = ? LIMIT 1', [$googleId, $email]);
if ($existing) {
    DB::exec(
        "UPDATE users
         SET google_id = ?, email = ?, display_name = ?, avatar_url = ?, last_login_at = NOW()
         WHERE id = ?",
        [$googleId, $email, $name !== '' ? $name : null, $avatarUrl !== '' ? $avatarUrl : null, (int) $existing['id']]
    );
    $userId = (int) $existing['id'];
} else {
    $userId = DB::insert(
        "INSERT INTO users (google_id, email, display_name, avatar_url, last_login_at)
         VALUES (?, ?, ?, ?, NOW())",
        [$googleId, $email, $name !== '' ? $name : null, $avatarUrl !== '' ? $avatarUrl : null]
    );
}

$user = DB::one('SELECT * FROM users WHERE id = ?', [$userId]);

// 6. Issue JWT (7 days).
$jwt = Jwt::encode([
    'sub'   => $userId,
    'email' => $email,
    'admin' => (int) ($user['is_admin'] ?? 0),
], 7 * 24 * 60 * 60);

// Set httpOnly cookie
$secure   = ($_SERVER['HTTPS'] ?? '') === 'on';
$cookieOk = setcookie('rideup_jwt', $jwt, [
    'expires'  => time() + 7 * 24 * 60 * 60,
    'path'     => '/',
    'secure'   => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
]);

Response::ok([
    'token' => $jwt,
    'user'  => [
        'id'          => (int) $user['id'],
        'email'       => $user['email'],
        'displayName' => $user['display_name'],
        'avatarUrl'   => $user['avatar_url'],
        'isAdmin'     => (int) $user['is_admin'] === 1,
    ],
]);
