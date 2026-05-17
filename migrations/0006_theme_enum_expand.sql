-- =====================================================================
-- 0006_theme_enum_expand.sql
--
-- Expands tenants.theme ENUM to accept the 5 new theme keys
-- (elegant, minimal, romantic, bold, luxe) while keeping the 4 legacy
-- keys (classic, modern, rustic, festive) so existing tenants keep
-- rendering. The frontend's normalizeThemeKey() maps legacy → modern
-- at render time, so nothing else needs to migrate.
--
-- Symptom before this migration: PATCH /api/admin/update-tenant.php
-- with theme='bold' (etc.) appears to succeed but the column silently
-- holds the previous value because the new key wasn't in the ENUM.
--
-- Run on Hostinger via phpMyAdmin → SQL tab.
-- =====================================================================

ALTER TABLE `tenants`
  MODIFY COLUMN `theme` ENUM(
    -- New keys (preferred)
    'elegant', 'minimal', 'romantic', 'bold', 'luxe',
    -- Legacy keys (kept for existing rows; normalized at render time)
    'classic', 'modern', 'rustic', 'festive'
  ) NOT NULL DEFAULT 'elegant';
