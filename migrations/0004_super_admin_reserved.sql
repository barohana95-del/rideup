-- =====================================================================
-- 0004_super_admin_reserved.sql
-- Reserve the super-admin path so no tenant can claim it.
-- =====================================================================

START TRANSACTION;

INSERT IGNORE INTO `reserved_slugs` (`slug`, `reason`) VALUES
('super-admin', 'platform owner panel'),
('sa',          'super-admin shorthand');

COMMIT;
