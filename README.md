# RideUp

פלטפורמת SaaS לניהול הסעות לאירועים.

## מבנה הפרויקט

```
rideup/                  # repo root = public_html/ on Hostinger
├── api/                 # PHP endpoints (web-accessible)
├── lib/                 # PHP helpers (denied via .htaccess)
├── migrations/          # SQL migrations (denied)
├── .htaccess
├── .env                 # local only — NOT committed
├── frontend/            # React + Vite (built locally, runs on localhost:3000)
└── docs/                # PRD, schema, roadmap
```

## פיתוח מקומי

### דרישות
- Node.js 18+
- Hostinger Premium (לbackend + DB)

### גישה היברידית
- **Frontend** רץ מקומית: `cd frontend && npm run dev` → `http://localhost:3000`.
- **Backend (PHP)** חי על Hostinger: `https://rideup.integrity-web.com/api/...`.
- **DB (MySQL)** על Hostinger.

Frontend מקומי מדבר ל-backend על Hostinger דרך CORS (מוגדר ב-`.env`).

### setup ראשון

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

**Backend:** ה-repo כולו מתפרס ל-`public_html/` על Hostinger דרך Git auto-deploy. צור קובץ `.env` באמצעות hPanel File Manager לפי `.env.example`.

## Multi-tenant routing

| Host | אזור |
|------|------|
| `rideup.co.il`            | marketing (landing) |
| `app.rideup.co.il`        | פאנל ניהול לקוחות |
| `<slug>.rideup.co.il`     | אתר ציבורי של לקוח (RSVP) |

בפיתוח (לפני שיש דומיין `.co.il`): `?tenant=<slug>` כ-override.

## תיעוד

- [docs/01-PRD.md](docs/01-PRD.md) — מסמך דרישות מוצר
- [docs/02-DB-Schema.sql](docs/02-DB-Schema.sql) — סכימת DB
- [docs/03-Roadmap.md](docs/03-Roadmap.md) — שלבי פיתוח
