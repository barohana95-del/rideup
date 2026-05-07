<?php
// =====================================================================
// jwt.php — minimal HMAC-SHA256 JWT (HS256) encode/decode.
// No external dependencies (Hostinger Shared friendly).
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/env.php';

class Jwt {
    private static function secret(): string {
        $s = Env::get('JWT_SECRET', '');
        if ($s === '' || strlen($s) < 32) {
            throw new RuntimeException('JWT_SECRET must be set and at least 32 chars');
        }
        return $s;
    }

    /** Encode payload + ttl seconds → compact JWT string. */
    public static function encode(array $payload, int $ttlSeconds = 604800): string {
        $now = time();
        $payload = array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $ttlSeconds,
        ]);

        $header  = ['alg' => 'HS256', 'typ' => 'JWT'];
        $headerB = self::base64url(json_encode($header,  JSON_UNESCAPED_SLASHES));
        $payloadB = self::base64url(json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

        $signature = hash_hmac('sha256', "$headerB.$payloadB", self::secret(), true);
        return "$headerB.$payloadB." . self::base64url($signature);
    }

    /**
     * Decode + verify JWT string. Returns the payload or null if invalid/expired.
     */
    public static function decode(string $jwt): ?array {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) return null;
        [$headerB, $payloadB, $signatureB] = $parts;

        $expected = self::base64url(hash_hmac('sha256', "$headerB.$payloadB", self::secret(), true));
        if (!hash_equals($expected, $signatureB)) return null;

        $payload = json_decode(self::base64urlDecode($payloadB), true);
        if (!is_array($payload)) return null;

        if (isset($payload['exp']) && time() >= (int) $payload['exp']) return null;

        return $payload;
    }

    private static function base64url(string $bin): string {
        return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
    }
    private static function base64urlDecode(string $s): string {
        $pad = strlen($s) % 4;
        if ($pad) $s .= str_repeat('=', 4 - $pad);
        return base64_decode(strtr($s, '-_', '+/')) ?: '';
    }
}
