# RideUp

פלטפורמת SaaS לניהול הסעות לאירועים.

## מבנה הפרויקט

```
rideup/
├── frontend/        # React + Vite + TypeScript
├── backend/         # PHP 8.1+ + MySQL (לרוץ על Hostinger Shared)
└── docs/            # PRD, סכימת DB, roadmap
```

## פיתוח מקומי

### דרישות
- Node.js 18+
- חשבון Hostinger Premium (לbackend + DB)

### גישה היברידית
- **Frontend** רץ מקומית (`npm run dev` → `localhost:3000`).
- **Backend (PHP)** חי על Hostinger בsubdomain dev (`dev.rideup.co.il`).
- **DB (MySQL)** על Hostinger.

### setup ראשון (Frontend)
```bash
cd frontend
cp .env.example .env.local      # ערוך VITE_API_URL ו-VITE_BASE_DOMAIN
npm install
npm run dev                      # http://localhost:3000
```

### setup ראשון (Backend)
1. ב-hPanel של Hostinger:
   - צור MySQL DB.
   - צור subdomain `dev.rideup.co.il`.
   - צור wildcard `*.dev.rideup.co.il` (אותו document root).
   - הפעל SSL.
   - הרץ את `docs/02-DB-Schema.sql` ב-phpMyAdmin.
2. העלה את כל תוכן `backend/` לתיקיית ה-document root של ה-subdomain (`public_html/dev/`).
3. צור `.env` בתיקייה הראשית של ה-backend (העתק מ-`.env.example`).
4. בדיקה: `https://dev.rideup.co.il/api/hello.php` צריך להחזיר JSON.

## אזורי האפליקציה (Multi-tenant routing)

| Host | אזור | הסבר |
|------|------|------|
| `rideup.co.il`            | marketing | דף נחיתה |
| `app.rideup.co.il`        | app       | פאנל ניהול לקוחות (after login) |
| `<slug>.rideup.co.il`     | tenant    | אתר ציבורי של לקוח (RSVP) |

ב-localhost נשתמש ב-`?tenant=<slug>` כ-override לבדיקת tenants.

## תיעוד

- [docs/01-PRD.md](docs/01-PRD.md) — מסמך דרישות מוצר
- [docs/02-DB-Schema.sql](docs/02-DB-Schema.sql) — סכימת DB
- [docs/03-Roadmap.md](docs/03-Roadmap.md) — שלבי פיתוח
