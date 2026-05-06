-- =====================================================================
-- 0002_path_based_routing.sql
--
-- Switch from subdomain-based to path-based tenant routing.
-- The DB itself doesn't change much — slugs are still globally unique —
-- but we expand `reserved_slugs` to cover all platform paths that must
-- never be confused with a tenant under `/<slug>`.
--
-- Run on Hostinger phpMyAdmin via Import.
-- =====================================================================

START TRANSACTION;

-- New reservations (idempotent — INSERT IGNORE skips duplicates)
INSERT IGNORE INTO `reserved_slugs` (`slug`, `reason`) VALUES
('onboarding', 'wizard route'),
('providers',  'providers page'),
('contact',    'contact page'),
('faq',        'faq page'),
('cookies',    'legal'),
('static',     'static assets'),
('assets',     'static assets'),
('cdn',        'static cdn'),
('logout',     'auth'),
('auth',       'auth'),
('app-store',  'brand reserved'),
('play-store', 'brand reserved');

COMMIT;
