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
//    Prefer a real user (matched by google_id), then any user with this email.
//    Stub users created by collaborators.php invites have google_id LIKE 'pending_%'.
$realExisting = DB::one('SELECT * FROM users WHERE google_id = ? LIMIT 1', [$googleId]);
$byEmail      = DB::all('SELECT * FROM users WHERE email = ?', [$email]);
$existing     = $realExisting ?: ($byEmail[0] ?? null);

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

// 5b. Claim any orphan stub users with the same email (other than this one).
//     Re-point their tenant_collaborators rows to this user, then delete the stubs.
//     This handles the case where the user already existed at the time of an
//     invite AND a stub got created anyway, or any pre-existing data drift.
$orphans = DB::all(
    "SELECT id FROM users
     WHERE email = ? AND id != ?
       AND (google_id LIKE 'pending_%' OR last_login_at IS NULL)",
    [$email, $userId]
);
foreach ($orphans as $orphan) {
    $orphanId = (int) $orphan['id'];
    try {
        // For each collab row on the orphan: if (tenant_id, $userId) already
        // exists, drop the orphan's row; otherwise reassign it.
        $orphanCollabs = DB::all(
            'SELECT tenant_id, role, accepted_at, invited_email, invite_token, invited_by, created_at
             FROM tenant_collaborators WHERE user_id = ?',
            [$orphanId]
        );
        foreach ($orphanCollabs as $oc) {
            $dup = DB::one(
                'SELECT 1 FROM tenant_collaborators WHERE tenant_id = ? AND user_id = ?',
                [(int) $oc['tenant_id'], $userId]
            );
            if ($dup) {
                DB::exec(
                    'DELETE FROM tenant_collaborators WHERE tenant_id = ? AND user_id = ?',
                    [(int) $oc['tenant_id'], $orphanId]
                );
            } else {
                // Mark as accepted now if it wasn't already.
                DB::exec(
                    "UPDATE tenant_collaborators
                     SET user_id = ?, accepted_at = COALESCE(accepted_at, NOW())
                     WHERE tenant_id = ? AND user_id = ?",
                    [$userId, (int) $oc['tenant_id'], $orphanId]
                );
            }
        }
        DB::exec('DELETE FROM users WHERE id = ?', [$orphanId]);
    } catch (Throwable $e) {
        error_log('Could not claim orphan user ' . $orphanId . ': ' . $e->getMessage());
    }
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
