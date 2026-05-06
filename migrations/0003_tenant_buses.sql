-- =====================================================================
-- 0003_tenant_buses.sql
--
-- Adds the per-tenant bus fleet table used by the Trip Planning feature.
-- Each row is a *bus type* the tenant has access to (a capacity tier).
-- The trip-planner picks combinations from this set per (city, shift)
-- to cover registered guests.
--
-- Run on Hostinger phpMyAdmin via Import.
-- =====================================================================

START TRANSACTION;

CREATE TABLE IF NOT EXISTS `tenant_buses` (
  `id`           INT(11)      NOT NULL AUTO_INCREMENT,
  `tenant_id`    INT(11)      NOT NULL,
  `capacity`     SMALLINT     NOT NULL,
  `label`        VARCHAR(60)  DEFAULT NULL,        -- "מיני", "אוטובוס תיירים" וכו'
  `display_order` SMALLINT    NOT NULL DEFAULT 0,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tenant` (`tenant_id`),
  CONSTRAINT `fk_bus_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
