# RideUp — Roadmap & מפת שלבים

**גרסה:** 0.1
**תאריך:** 2026-05-04

---

## עקרונות עבודה

1. **Ship vertical slices** — בכל שלב מסיימים פיצ'ר מקצה-לקצה (DB → API → UI), לא בונים שכבה-שכבה.
2. **בלי refactor של הקיים בלי צורך** — מערכת החתונה הנוכחית ממשיכה לעבוד ב-deployment נפרד. ה-SaaS הוא repo/branch חדש.
3. **Manual QA אחרי כל שלב** — בלי בדיקות אוטומטיות ב-MVP (overhead מיותר ל-developer יחיד).
4. **Deploy מוקדם, לעיתים קרובות** — staging environment על subdomain מוסתר (`staging.rideup.co.il`) מהשלב הראשון.

---

## מבנה Repository מוצע

```
rideup/
├── frontend/                     # Vite + React (יש כבר)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── marketing/        # דף נחיתה, pricing, about
│   │   │   ├── onboarding/       # wizard
│   │   │   ├── admin/            # פאנל ניהול לקוח
│   │   │   └── public/           # אתר ה-RSVP של ה-tenant
│   │   ├── themes/               # 4 themes
│   │   │   ├── classic/
│   │   │   ├── modern/
│   │   │   ├── rustic/
│   │   │   └── festive/
│   │   ├── components/
│   │   ├── lib/
│   │   └── services/
│   └── vite.config.ts
│
├── backend/                      # PHP (יש כבר, ירחיב)
│   ├── api/
│   │   ├── auth/                 # Google OAuth callback
│   │   ├── tenants/              # CRUD tenants
│   │   ├── onboarding/           # שלבי wizard
│   │   ├── billing/              # PayPlus webhooks
│   │   ├── public/               # endpoints לאתר הציבורי (RSVP)
│   │   └── admin/                # endpoints לפאנל ניהול לקוח
│   ├── lib/
│   │   ├── tenant_middleware.php
│   │   ├── auth.php
│   │   ├── db.php
│   │   └── email.php             # brevo wrapper
│   └── migrations/
│       ├── 0001_initial.sql      # = 02-DB-Schema.sql
│       └── ...
│
├── docs/                         # התיק הנוכחי
└── public_html/                  # הקבצים שעולים ל-Hostinger (build output)
```

---

## שלבים

### שלב 0 — תשתית (1-2 ימים) — גישה היברידית

**מטרה:** סביבה עובדת על Hostinger (PHP+MySQL) + dev מקומי של frontend, אין פיצ'ר עדיין.

#### על השרת (Hostinger)
- [ ] חשבון Hostinger Premium ומעלה (או שדרוג אם Single).
- [ ] subdomain זמני לפיתוח: `dev.{HOSTINGER_FREE_SUBDOMAIN}` או `dev.rideup.co.il` אם הדומיין כבר נקנה.
- [ ] הפעלת SSL (Let's Encrypt).
- [ ] **Wildcard DNS + SSL** — `*.dev.rideup.co.il` או `*.{free-subdomain}` (Hostinger Premium ומעלה תומך).
- [ ] יצירת DB ב-MySQL → הרצת `02-DB-Schema.sql` דרך phpMyAdmin.
- [ ] הגדרת Git auto-deploy (Hostinger → Git integration → connect to GitHub repo).
- [ ] בדיקה: `index.php` שמדפיס "hello from rideup" → מועלה דרך Git.

#### חשבונות חיצוניים (לא חוסם — אפשר אחרי שלב 1)
- [ ] קניית דומיין `rideup.co.il` (אחרי בדיקת Trademark).
- [ ] בדיקת Trademark ב-justice.gov.il.
- [ ] Google Cloud project + OAuth 2.0 Client ID (Web). redirect URIs ל-dev + production.
- [ ] חשבון brevo (אימות domain — יקרה אחרי שיש דומיין).
- [ ] חשבון PayPlus/Tranzila — sandbox קודם (יידחה לשלב 7).

#### מקומית
- [ ] `git clone` של ה-repo החדש.
- [ ] `npm install` + `npm run dev` עובד (Vite frontend).
- [ ] קובץ `.env.local` עם `VITE_API_URL=https://dev.rideup.co.il/api` (או free subdomain).
- [ ] בדיקה: `fetch(API_URL + '/hello.php')` מ-frontend מחזיר "hello from rideup".

**מסלול בדיקה:** Frontend מקומי על `localhost:3000` קורא ל-API על Hostinger ומקבל תשובה.

---

### שלב 1 — Skeleton של ה-multi-tenant routing (2-3 ימים)

**מטרה:** הפלטפורמה מבדילה בין landing, app ו-tenant subdomains.

- [ ] ב-PHP: `lib/tenant_middleware.php` שמחלץ `tenant` מ-`$_SERVER['HTTP_HOST']`.
  - `rideup.co.il` → no tenant (marketing)
  - `app.rideup.co.il` → no tenant (admin shell)
  - `<slug>.rideup.co.il` → לחפש ב-`tenants.slug`. אם לא קיים → 404.
- [ ] ב-frontend: React Router עם 3 "אזורים":
  - Marketing (root)
  - App (subdomain `app`)
  - Tenant public (any other subdomain)
- [ ] Vite build יחיד שמסתעף לפי `window.location.hostname`.
- [ ] דף 404 יפה ל-slug לא קיים.

**מסלול בדיקה:** `rideup.co.il` מציג landing-placeholder, `foo.rideup.co.il` מציג 404, `app.rideup.co.il` מציג "App shell".

---

### שלב 2 — Auth (Google Sign-In) (2 ימים)

**מטרה:** משתמש יכול להיכנס דרך Google ולקבל JWT.

- [ ] `backend/api/auth/google.php` — מקבל ID token מהקליינט, מאמת מול Google, יוצר/מעדכן `users` row, מחזיר JWT.
- [ ] JWT ב-cookie httpOnly + refresh logic.
- [ ] `lib/auth.php` — middleware שמחלץ user מה-JWT.
- [ ] ב-frontend: כפתור "התחבר עם Google" (Google Identity Services).
- [ ] דף `/me` בסיסי (מציג שם + מייל) להוכחת הקונספט.
- [ ] Logout.

**מסלול בדיקה:** התחברות → רואה את השם שלי → logout → לא רואה.

---

### שלב 3 — Onboarding Wizard (4-5 ימים)

**מטרה:** משתמש יכול ליצור tenant מקצה-לקצה (בלי תשלום אמיתי עדיין — לדמות).

- [ ] State management ב-frontend (zustand או React Context) ל-draft.
- [ ] שלב 1: בחירת חבילה (Trial / Basic / Pro / Premium — אבל רק Trial פעיל).
- [ ] שלב 2: בחירת slug + בדיקת זמינות (debounced API call).
- [ ] שלב 3: בחירת theme (4 thumbnails).
- [ ] שלב 4: פרטי אירוע (סוג, שמות, תאריך, מקום).
- [ ] שלב 5: ערים (multi-select מ-`default_cities` + הוספה).
- [ ] שלב 6: משמרות חזרה (toggle + רשימה דינמית).
- [ ] שלב 7: טקסטים (עם defaults לפי event_type).
- [ ] שלב 8: סיום → POST ל-`/api/onboarding/finalize` שיוצר tenant + cities + shifts + settings.
- [ ] שמירת draft אוטומטית ב-localStorage.
- [ ] ניווט בין שלבים, validation לפני מעבר.

**מסלול בדיקה:** מסיים onboarding → רואה ב-DB tenant חדש עם כל הקשרים.

---

### שלב 4 — האתר הציבורי של ה-tenant (3-4 ימים)

**מטרה:** `<slug>.rideup.co.il` מציג טופס RSVP מלא לפי ההגדרות של ה-tenant.

- [ ] העברת רכיבי ה-RSVP מהקיים → תיקייה `pages/public/`.
- [ ] טעינת `tenant` config דרך API (`/api/public/config`).
- [ ] רכיב ThemeProvider שטוען theme לפי `tenant.theme`.
- [ ] בניית theme אחד מלא (classic) — בסיס לשאר.
- [ ] טופס הרשמה → POST ל-`/api/public/register` (עם tenant_id מה-host).
- [ ] דף תודה עם הפרטים שהזין.
- [ ] "Powered by RideUp" ב-footer.

**מסלול בדיקה:** `mihal.rideup.co.il` נראה כמו אתר חתונה אמיתי, רישום נשמר ב-DB עם ה-tenant_id הנכון.

---

### שלב 5 — פאנל ניהול לקוח (4-5 ימים)

**מטרה:** הלקוח רואה ומנהל את הרישומים שלו, עורך עיצוב, מתכנן הסעות.

- [ ] `app.rideup.co.il/<slug>` — דורש Auth + ownership check.
- [ ] **Tab: רישומים** — טבלה, חיפוש, מיון, סינון לפי עיר/משמרת.
- [ ] CRUD ידני (להוסיף/לערוך/למחוק רישום).
- [ ] **Tab: סטטיסטיקה** — סה"כ אורחים, פילוח עיר, פילוח משמרת.
- [ ] **Tab: הגדרות אירוע** — עריכת onboarding fields.
- [ ] **Tab: עיצוב (Editor Mode)** — color picker, העלאת לוגו/cover, בחירת פונט, live preview, שינוי slug.
- [ ] **Tab: תכנון נסיעה** — מאגר אוטובוסים, חישוב first-fit-decreasing, ייצוא Excel.
- [ ] **כפתור "בקש סקירה מצוות RideUp"** — שולח לי מייל.
- [ ] ייצוא Excel רשימת אורחים.

**מסלול בדיקה:** הבעלים נכנס, רואה את 5 הרישומים שיצר, מייצא Excel.

---

### שלב 6 — דף נחיתה (3-4 ימים)

**מטרה:** דף נחיתה אמיתי שיכול להמיר.

- [ ] עיצוב Hero + CTA.
- [ ] "איך זה עובד" — 3 צעדים.
- [ ] טבלת חבילות.
- [ ] FAQ (10 שאלות נפוצות).
- [ ] טופס יצירת קשר (שולח מייל).
- [ ] Footer + עמודי תקנון/פרטיות (טמפלייט גנרי, לבדוק עם עו"ד אחר כך).
- [ ] Analytics (GA4 / Plausible).

**מסלול בדיקה:** דף נחיתה חי, "התחל בחינם" מוביל ל-Google login → onboarding.

---

### שלב 7 — Billing אמיתי (3-4 ימים)

**מטרה:** Tier "Basic" עובד בכסף אמיתי.

- [ ] חתימה על PayPlus / Tranzila.
- [ ] יצירת payment session דרך ה-API שלהם.
- [ ] redirect ל-checkout, חזרה ל-`/onboarding/payment-result`.
- [ ] Webhook endpoint שמאמת חתימה ומעדכן `payments` + `subscriptions` + `tenants.status`.
- [ ] חשבונית — דרך iCount / Greeninvoice (יש להם API). אופציונלי, אפשר ידני בהתחלה.
- [ ] מייל "תודה על הרכישה" עם פרטי האירוע.

**מסלול בדיקה:** תשלום ב-sandbox → tenant עובר ל-`active` → מייל יוצא.

---

### שלב 8 — 3 themes נוספים + ליטוש (3 ימים)

**מטרה:** modern, rustic, festive.

- [ ] modern (sans-serif נקי, גרדיאנטים).
- [ ] rustic (צבעי אדמה, טקסטורות).
- [ ] festive (זהב, חם, חגיגי).
- [ ] Theme switcher בפאנל הניהול (החלפה מאוחרת).

---

### שלב 9 — Lifecycle: Trial / Active / Archived (3 ימים)

**מטרה:** מעבר בין סטטוסים אוטומטי, ארכיון פעיל.

- [ ] Cron יומי שבודק `trial_ends_at` ו-`paid_until`.
- [ ] Trial → Expired אחרי 14 יום ללא שדרוג.
- [ ] Active → Archived 30 יום אחרי `event_date`.
- [ ] Archived: האתר הציבורי 404, פאנל ב-read-only עם "ייצוא" ו"העתק לאירוע חדש".
- [ ] בפאנל: באנר + מודאל "השדרג עכשיו" כש-Trial קרוב לסוף.
- [ ] באתר הציבורי: אם expired/archived — טופס ההרשמה disabled.
- [ ] אימייל אזהרה 3 ימים לפני סוף Trial + ביום סיום.
- [ ] אימייל "האירוע שלך נשמר בארכיון" אחרי האירוע.
- [ ] "Tab: ארכיון" בפאנל הראשי של המשתמש (כל ה-tenants הישנים שלו).

---

### שלב 10 — תיעוד תהליך + Launch (2 ימים)

- [ ] תיקיית `docs/help/` — מדריכים בעברית למשתמש (איך מתחילים, איך מנהלים, FAQ).
- [ ] תפריט עזרה בפאנל מקושר למסמכים.
- [ ] Soft launch — לחבר/משפחה. 5 משתמשים אמיתיים.
- [ ] איסוף משוב, תיקונים.
- [ ] Public launch — פוסט ב-Facebook / קבוצות חתונה.

---

## אומדן זמנים כולל

| שלב | תיאור | ימים מוערכים |
|----|-------|----|
| 0  | תשתית | 1-2 |
| 1  | Multi-tenant routing | 2-3 |
| 2  | Google Auth | 2 |
| 3  | Onboarding wizard | 4-5 |
| 4  | אתר ציבורי | 3-4 |
| 5  | פאנל ניהול | 3-4 |
| 6  | דף נחיתה | 3-4 |
| 7  | Billing | 3-4 |
| 8  | Themes נוספים | 3 |
| 9  | Trial lifecycle | 2 |
| 10 | Launch | 2 |
| **סה"כ** | | **28-37 ימי עבודה** |

ב-עבודה של 4 שעות ביום (פרויקט צד) → **3-4 חודשים**. בעבודה במשרה מלאה → 6-8 שבועות.

---

## פוסט-MVP — סדר עדיפויות

1. Pro tier הפעלה + ייצוא PDF לנהג.
2. SMS/WhatsApp דרך smoove.
3. Premium tier הפעלה + עיצוב מותאם.
4. ספרייה של ספקי הסעות (catalog בלבד).
5. Dashboard מתקדם עם גרפים.
6. תזכורות אוטומטיות לאורחים.
7. אינטגרציה ליומן (ICS / Google Calendar).
8. תמיכה בשפות נוספות (אנגלית).
9. אפליקציית מובייל לבעלים (PWA תחילה).

---

## מדדים שצריך לעקוב מהיום הראשון

- כמה אנשים נכנסו ל-landing.
- כמה לחצו "התחל בחינם".
- כמה השלימו Google Sign-In.
- כמה השלימו onboarding (פר-שלב — לראות איפה נושרים).
- כמה Trial → Paid conversion.
- LTV ממוצע פר-tenant.
- כמה רישומים פר-tenant ממוצע (לוודא שזה בכלל בשימוש).
