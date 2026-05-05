<?php
// =====================================================================
// GET /api/onboarding/check-slug.php?slug=foo
// Returns: { success: true, data: { available: bool } }
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/db.php';

$slug = strtolower(trim($_GET['slug'] ?? ''));

if (!preg_match('/^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/', $slug)) {
    Response::error('Invalid slug format', 400, 'bad_slug');
}

// Reserved subdomains
$reserved = DB::one('SELECT slug FROM reserved_slugs WHERE slug = ?', [$slug]);
if ($reserved) {
    Response::ok(['available' => false, 'reason' => 'reserved']);
}

// Already taken?
$taken = DB::one(
    "SELECT id FROM tenants WHERE slug = ? AND status NOT IN ('deleted')",
    [$slug]
);

Response::ok(['available' => $taken === null]);
