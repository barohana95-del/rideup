<?php
// =====================================================================
// db.php — חיבור PDO ל-MySQL/MariaDB.
// singleton; הגדרות מ-.env.
// =====================================================================
declare(strict_types=1);

require_once __DIR__ . '/env.php';

class DB {
    private static ?PDO $pdo = null;

    public static function pdo(): PDO {
        if (self::$pdo !== null) return self::$pdo;

        $host = Env::get('DB_HOST', 'localhost');
        $port = Env::get('DB_PORT', '3306');
        $name = Env::require('DB_NAME');
        $user = Env::require('DB_USER');
        $pass = Env::require('DB_PASS');

        $dsn = "mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4";

        try {
            self::$pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            // לא חושפים פרטי DB ללקוח.
            error_log('DB connection failed: ' . $e->getMessage());
            require_once __DIR__ . '/response.php';
            Response::error('Database unavailable', 503, 'db_unavailable');
        }

        return self::$pdo;
    }

    /**
     * Helper: query עם פרמטרים מוכנים, מחזיר את כל השורות.
     */
    public static function all(string $sql, array $params = []): array {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Helper: query עם פרמטרים, מחזיר שורה אחת או null.
     */
    public static function one(string $sql, array $params = []): ?array {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    /**
     * Helper: INSERT/UPDATE/DELETE, מחזיר rowCount.
     */
    public static function exec(string $sql, array $params = []): int {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    /**
     * Helper: INSERT, מחזיר ה-id האחרון שנוצר.
     */
    public static function insert(string $sql, array $params = []): int {
        self::exec($sql, $params);
        return (int) self::pdo()->lastInsertId();
    }
}
