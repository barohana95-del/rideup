# Legacy reference

קבצים שהועתקו מ-`WeddingTransportation` (single-tenant) כרפרנס ל-rewrite.

**לא נכלל ב-build / type-check**. הקבצים האלה נמחקים אחרי שהמקבילה ב-multi-tenant מוכנה:

| Legacy | יוחלף ב | שלב |
|--------|---------|------|
| `Home.tsx`            | `pages/public/TenantApp.tsx`         | 4 |
| `ThankYou.tsx`        | `pages/public/ThankYouPage.tsx`      | 4 |
| `Dashboard.tsx`       | `pages/admin/AdminApp.tsx` + tabs    | 5 |
| `Login.tsx`           | חליף ב-Google OAuth ב-MarketingApp   | 2 |
| `DashboardLayout.tsx` | רכיב Layout חדש בpאדמין              | 5 |
