# RideUp Backend (PHP)

PHP 8.1+ on Hostinger Shared Hosting.

## מבנה

```
backend/
├── api/                  # endpoints (כל קובץ = endpoint)
│   ├── hello.php
│   ├── public/           # endpoints לאתר ציבורי (RSVP)
│   ├── admin/            # endpoints לפאנל ניהול (דורש auth)
│   ├── auth/             # Google OAuth callbacks
│   ├── onboarding/       # שלבי wizard
│   └── billing/          # PayPlus webhooks
├── lib/                  # helpers (לא נגיש מ-web בזכות .htaccess)
│   ├── env.php           # טעינת .env
│   ├── response.php      # JSON helpers
│   ├── db.php            # PDO singleton
│   ├── tenant.php        # חילוץ tenant מה-host
│   ├── cors.php          # CORS headers
│   └── bootstrap.php     # require_once בכל endpoint
├── migrations/           # סכימת DB + שינויים
└── .htaccess             # security + routing
```

## כללי כתיבת endpoint

```php
<?php
declare(strict_types=1);
require_once __DIR__ . '/../lib/bootstrap.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/tenant.php';

// קבלת tenant אם רלוונטי:
$tenant = Tenant::require();   // 400 אם אין
// או:
$tenant = Tenant::current();   // null אם אין

// קבלת body:
$body = read_json_body();

// query:
$rows = DB::all('SELECT * FROM registrations WHERE tenant_id = ?', [$tenant['id']]);

// תשובה:
Response::ok($rows);
```

## בדיקה מקומית (אחרי שה-backend על Hostinger)

```bash
curl https://dev.rideup.co.il/api/hello.php
# → {"success":true,"data":{"message":"hello from rideup",...}}
```
