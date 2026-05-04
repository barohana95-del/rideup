-- =====================================================================
-- RideUp — Multi-tenant SaaS Database Schema
-- Version: 0.1
-- Target: MySQL 5.7+ / MariaDB 10.3+ (Hostinger Shared Hosting compatible)
-- =====================================================================
--
-- מבנה כללי:
--   users          — משתמשי הפלטפורמה (בעלי tenants)
--   tenants        — כל "אתר" של לקוח (אירוע אחד = tenant אחד)
--   subscriptions  — היסטוריית חבילות ותשלומים פר-tenant
--   payments       — תשלומים בודדים (audit trail)
--   tenant_cities  — ערים פר-tenant (מחליף את `cities` הגלובלי)
--   tenant_shifts  — משמרות חזרה פר-tenant (מחליף `return_times`)
--   tenant_settings — הגדרות key-value פר-tenant (מחליף `settings`)
--   registrations  — אורחים שנרשמו (כמו היום, +tenant_id)
--   audit_log      — log של פעולות רגישות
--   email_log      — log של אימיילים שיצאו (debug, rate-limit)
--
-- הערה: הסכימה הקיימת (registrations / cities / return_times / settings /
-- admin_users) נטמעת מחדש עם תוספת `tenant_id` בכל מקום רלוונטי.
-- admin_users מחליף את users + Google OAuth — admin_users נמחק.
-- =====================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
START TRANSACTION;

-- ---------------------------------------------------------------------
-- users — משתמשי הפלטפורמה (Google OAuth)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`               INT(11)      NOT NULL AUTO_INCREMENT,
  `google_id`        VARCHAR(64)  NOT NULL,
  `email`            VARCHAR(255) NOT NULL,
  `display_name`     VARCHAR(120) DEFAULT NULL,
  `avatar_url`       VARCHAR(500) DEFAULT NULL,
  `phone`            VARCHAR(20)  DEFAULT NULL,
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at`    TIMESTAMP    NULL DEFAULT NULL,
  `is_admin`         TINYINT(1)   NOT NULL DEFAULT 0,  -- מנהל פלטפורמה (אני)
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_google_id` (`google_id`),
  UNIQUE KEY `uniq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- tenants — כל אירוע של לקוח. ה-"מותג" של הסכימה.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tenants` (
  `id`               INT(11)      NOT NULL AUTO_INCREMENT,
  `slug`             VARCHAR(60)  NOT NULL,                -- mihal-and-yossi
  `owner_user_id`    INT(11)      NOT NULL,
  `status`           ENUM('draft','trial','active','expired','suspended','deleted') NOT NULL DEFAULT 'draft',
  `plan`             ENUM('trial','basic','pro','premium') NOT NULL DEFAULT 'trial',
  `theme`            ENUM('classic','modern','rustic','festive') NOT NULL DEFAULT 'classic',

  -- פרטי האירוע (מה שהמשתמש מילא ב-onboarding)
  `event_type`       ENUM('wedding','bar_mitzvah','bat_mitzvah','birthday','corporate','other') NOT NULL DEFAULT 'wedding',
  `event_title`      VARCHAR(200) DEFAULT NULL,             -- "אביב & בר" / "החתונה של דני"
  `event_date`       DATE         DEFAULT NULL,
  `event_time`       TIME         DEFAULT NULL,
  `event_location`   VARCHAR(255) DEFAULT NULL,             -- כתובת חופשית
  `event_address_lat` DECIMAL(10,7) DEFAULT NULL,           -- אופציונלי, לעתיד (מפה)
  `event_address_lng` DECIMAL(10,7) DEFAULT NULL,

  -- features מופעלים פר-tenant (JSON של מערך feature keys)
  -- דוגמה: {"export_excel": true, "sms_reminders": false}
  `features_json`    JSON         DEFAULT NULL,

  -- Branding
  `logo_url`         VARCHAR(500) DEFAULT NULL,
  `cover_image_url`  VARCHAR(500) DEFAULT NULL,
  `show_powered_by`  TINYINT(1)   NOT NULL DEFAULT 1,       -- מוסר אוטומטית ב-Pro+

  -- חלון פעילות
  `trial_started_at` TIMESTAMP    NULL DEFAULT NULL,
  `trial_ends_at`    TIMESTAMP    NULL DEFAULT NULL,
  `paid_until`       TIMESTAMP    NULL DEFAULT NULL,         -- עד מתי האתר חי

  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_slug` (`slug`),
  KEY `idx_owner` (`owner_user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_tenant_owner` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- subscriptions — היסטוריית מינויים (audit + שדרוגים עתידיים)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id`               INT(11)      NOT NULL AUTO_INCREMENT,
  `tenant_id`        INT(11)      NOT NULL,
  `plan`             ENUM('trial','basic','pro','premium') NOT NULL,
  `started_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ends_at`          TIMESTAMP    NULL DEFAULT NULL,
  `payment_id`       INT(11)      DEFAULT NULL,
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tenant` (`tenant_id`),
  CONSTRAINT `fk_sub_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- payments — תשלומים בודדים (audit trail מספק התשלום)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `id`                  INT(11)        NOT NULL AUTO_INCREMENT,
  `tenant_id`           INT(11)        NOT NULL,
  `user_id`             INT(11)        NOT NULL,
  `provider`            ENUM('payplus','tranzila','stripe','manual') NOT NULL,
  `provider_txn_id`     VARCHAR(120)   DEFAULT NULL,
  `amount_agorot`       INT(11)        NOT NULL,            -- ₪149.00 = 14900
  `currency`            VARCHAR(3)     NOT NULL DEFAULT 'ILS',
  `plan`                ENUM('basic','pro','premium')       NOT NULL,
  `status`              ENUM('pending','succeeded','failed','refunded') NOT NULL DEFAULT 'pending',
  `raw_response`        JSON           DEFAULT NULL,
  `invoice_number`      VARCHAR(50)    DEFAULT NULL,         -- לחשבונית
  `created_at`          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tenant` (`tenant_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_provider_txn` (`provider`, `provider_txn_id`),
  CONSTRAINT `fk_pay_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pay_user`   FOREIGN KEY (`user_id`)   REFERENCES `users` (`id`)   ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- tenant_cities — ערים פר-tenant (מחליף `cities` הגלובלי)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tenant_cities` (
  `id`           INT(11)      NOT NULL AUTO_INCREMENT,
  `tenant_id`    INT(11)      NOT NULL,
  `name`         VARCHAR(100) NOT NULL,
  `display_order` SMALLINT    NOT NULL DEFAULT 0,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_tenant_city` (`tenant_id`, `name`),
  CONSTRAINT `fk_city_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- tenant_shifts — משמרות חזרה פר-tenant
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tenant_shifts` (
  `id`           INT(11)      NOT NULL AUTO_INCREMENT,
  `tenant_id`    INT(11)      NOT NULL,
  `time_label`   VARCHAR(100) NOT NULL,                       -- "סבב א' - 00:00"
  `display_order` SMALLINT    NOT NULL DEFAULT 0,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tenant` (`tenant_id`),
  CONSTRAINT `fk_shift_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- tenant_settings — Key-value settings פר-tenant (טקסטים, flags)
--   דוגמאות: invitation_text, instructions_text, use_shifts, primary_color
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tenant_settings` (
  `tenant_id`    INT(11)      NOT NULL,
  `key`          VARCHAR(60)  NOT NULL,
  `value`        TEXT         DEFAULT NULL,
  `updated_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tenant_id`, `key`),
  CONSTRAINT `fk_setting_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- registrations — אורחים שנרשמו (פר-tenant)
--   הוספנו: tenant_id, email (אופציונלי), confirmed_at
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrations` (
  `id`               INT(11)      NOT NULL AUTO_INCREMENT,
  `tenant_id`        INT(11)      NOT NULL,
  `full_name`        VARCHAR(100) NOT NULL,
  `phone_number`     VARCHAR(20)  NOT NULL,
  `email`            VARCHAR(255) DEFAULT NULL,
  `num_guests`       TINYINT(4)   NOT NULL DEFAULT 1,
  `city`             VARCHAR(100) DEFAULT NULL,
  `return_shift`     VARCHAR(100) DEFAULT NULL,
  `notes`            TEXT         DEFAULT NULL,
  `confirmed_at`     TIMESTAMP    NULL DEFAULT NULL,
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `source_ip`        VARCHAR(45)  DEFAULT NULL,               -- לחקירת spam
  PRIMARY KEY (`id`),
  -- ייחודיות פר-tenant: אותו טלפון יכול להופיע באירועים שונים
  UNIQUE KEY `uniq_tenant_phone` (`tenant_id`, `phone_number`),
  KEY `idx_tenant_created` (`tenant_id`, `created_at`),
  CONSTRAINT `fk_reg_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- audit_log — פעולות רגישות (deletion, plan change, slug change)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id`           BIGINT       NOT NULL AUTO_INCREMENT,
  `tenant_id`    INT(11)      DEFAULT NULL,
  `actor_user_id` INT(11)     DEFAULT NULL,
  `action`       VARCHAR(60)  NOT NULL,                        -- 'tenant.created', 'plan.upgraded'
  `entity_type`  VARCHAR(40)  DEFAULT NULL,
  `entity_id`    INT(11)      DEFAULT NULL,
  `metadata`     JSON         DEFAULT NULL,
  `ip`           VARCHAR(45)  DEFAULT NULL,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tenant_action` (`tenant_id`, `action`),
  KEY `idx_actor` (`actor_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- email_log — אימיילים שיצאו (debug + rate limit)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `email_log` (
  `id`           BIGINT       NOT NULL AUTO_INCREMENT,
  `tenant_id`    INT(11)      DEFAULT NULL,
  `to_email`     VARCHAR(255) NOT NULL,
  `template`     VARCHAR(60)  NOT NULL,                        -- 'welcome', 'receipt', 'rsvp_confirm'
  `provider`     VARCHAR(20)  NOT NULL DEFAULT 'brevo',
  `provider_id`  VARCHAR(120) DEFAULT NULL,
  `status`       ENUM('queued','sent','failed','bounced') NOT NULL DEFAULT 'queued',
  `error`        TEXT         DEFAULT NULL,
  `sent_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tenant` (`tenant_id`),
  KEY `idx_to` (`to_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- שמורות slug — מילים שאסור שמשתמש יבחר (התנגשות עם subdomains מערכתיים)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reserved_slugs` (
  `slug`         VARCHAR(60)  NOT NULL,
  `reason`       VARCHAR(120) DEFAULT NULL,
  PRIMARY KEY (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reserved_slugs` (`slug`, `reason`) VALUES
('www',     'system'),
('app',     'admin panel'),
('api',     'api'),
('admin',   'platform admin'),
('mail',    'email'),
('blog',    'future'),
('docs',    'docs'),
('help',    'support'),
('support', 'support'),
('billing', 'billing'),
('checkout','payment'),
('login',   'auth'),
('signup',  'auth'),
('about',   'marketing'),
('pricing', 'marketing'),
('terms',   'legal'),
('privacy', 'legal'),
('rideup',  'brand');


-- ---------------------------------------------------------------------
-- Default city catalog — נטען לתוך tenant_cities ב-onboarding
-- (הטבלה הגלובלית `cities` של הסכימה הישנה, נשמרת כקטלוג להצעה)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `default_cities` (
  `id`   INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `default_cities` (`name`) VALUES
('תל אביב'), ('ירושלים'), ('חיפה'), ('ראשון לציון'), ('פתח תקווה'),
('אשדוד'), ('נתניה'), ('בני ברק'), ('חולון'), ('רמת גן'),
('באר שבע'), ('הרצליה'), ('כפר סבא'), ('רחובות'), ('רעננה'),
('מודיעין'), ('בית שמש'), ('אשקלון'), ('נצרת'), ('אילת');


COMMIT;

-- =====================================================================
-- הערות יישום
-- =====================================================================
--
-- 1. Multi-tenant isolation:
--    כל query מהאפליקציה חייב לכלול WHERE tenant_id = ?.
--    Middleware ב-PHP יחלץ tenant מה-subdomain (או מה-JWT אם בפאנל)
--    ויזריק לכל בקשה.
--
-- 2. Slug → tenant_id lookup:
--    SELECT id FROM tenants WHERE slug = ? AND status IN ('trial','active').
--    יש לקאש ברמת PHP (APCu) לשבריר שנייה.
--
-- 3. JSON columns:
--    דורש MySQL 5.7+. Hostinger Shared מספק. אם לא — נחליף ל-TEXT עם
--    טיפול ידני ב-PHP.
--
-- 4. Migrations עתידיים:
--    כל שינוי סכימה יישב בקובץ migrations/NNNN_description.sql,
--    מספור עוקב, רץ דרך סקריפט CLI (לא דרך panel).
--
-- 5. Backups:
--    Hostinger מספק יומי. בנוסף נריץ mysqldump weekly ל-S3 / Drive.
--
-- =====================================================================
