<?php
// api/public/register.php
declare(strict_types=1);

require_once __DIR__ . '/../../lib/bootstrap.php';
require_once __DIR__ . '/../../lib/tenant.php';
require_once __DIR__ . '/../../lib/response.php';

$tenant = Tenant::require();

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    Response::error('Invalid JSON', 400);
}

$fullName = trim($data['fullName'] ?? '');
$phoneNumber = trim($data['phoneNumber'] ?? '');
$numGuests = (int)($data['numGuests'] ?? 1);
$city = isset($data['city']) ? trim($data['city']) : null;
$returnShift = isset($data['returnShift']) ? trim($data['returnShift']) : null;
$notes = isset($data['notes']) ? trim($data['notes']) : null;
$email = isset($data['email']) ? trim($data['email']) : null;

if ($fullName === '' || $phoneNumber === '') {
    Response::error('שם ומספר טלפון הם שדות חובה', 400);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? null;

DB::exec(
    "INSERT INTO registrations (tenant_id, full_name, phone_number, email, num_guests, city, return_shift, notes, source_ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
        full_name = VALUES(full_name),
        email = VALUES(email),
        num_guests = VALUES(num_guests),
        city = VALUES(city),
        return_shift = VALUES(return_shift),
        notes = VALUES(notes),
        updated_at = CURRENT_TIMESTAMP",
    [
        $tenant['id'],
        $fullName,
        $phoneNumber,
        $email ?: null,
        $numGuests,
        $city ?: null,
        $returnShift ?: null,
        $notes ?: null,
        $ip
    ]
);

$id = (int) DB::pdo()->lastInsertId();
if ($id === 0) {
    // ON DUPLICATE KEY UPDATE might return 0 if no changes were made.
    $row = DB::one("SELECT id FROM registrations WHERE tenant_id = ? AND phone_number = ?", [$tenant['id'], $phoneNumber]);
    $id = (int) ($row['id'] ?? 0);
}

Response::ok(['id' => $id]);
