-- =====================================================================
-- 0005_tenant_collaborators.sql
--
-- Multi-user access per tenant. The owner can invite collaborators
-- by email and assign them roles (editor / viewer).
-- =====================================================================

START TRANSACTION;

CREATE TABLE IF NOT EXISTS `tenant_collaborators` (
  `tenant_id`     INT(11)      NOT NULL,
  `user_id`       INT(11)      NOT NULL,
  `role`          ENUM('owner','editor','viewer') NOT NULL DEFAULT 'viewer',
  `invited_by`    INT(11)      DEFAULT NULL,
  `invited_email` VARCHAR(255) DEFAULT NULL,
  `invite_token`  VARCHAR(64)  DEFAULT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accepted_at`   TIMESTAMP    NULL DEFAULT NULL,
  PRIMARY KEY (`tenant_id`, `user_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_token` (`invite_token`),
  CONSTRAINT `fk_collab_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collab_user`   FOREIGN KEY (`user_id`)   REFERENCES `users` (`id`)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Backfill: existing owners are also collaborators with role='owner'.
INSERT IGNORE INTO `tenant_collaborators` (`tenant_id`, `user_id`, `role`, `accepted_at`)
SELECT id, owner_user_id, 'owner', created_at FROM `tenants` WHERE status != 'deleted';

COMMIT;
