/* migrated from database/migrations/2025_08_19_223359_create_notifications_table.php */

/**
 * @TODO: Adjust data types based on your specific SQL database (PostgreSQL, MySQL, SQLite, etc.)
 * - UUID PRIMARY KEY: Supported by PostgreSQL, often stored as BINARY(16) or VARCHAR(36) in MySQL.
 * - BIGINT for notifiable_id: Consider BIGINT UNSIGNED for MySQL.
 * - TEXT: May map to CLOB in some databases for very large text.
 * - JSON: Supported directly by PostgreSQL/MySQL 5.7+, may need TEXT/BLOB for others.
 * - TIMESTAMP NULL: Check database specific defaults for TIMESTAMP (e.g., ON UPDATE CURRENT_TIMESTAMP in MySQL).
 */

export const SQL_UP = `CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    notifiable_type VARCHAR(255) NOT NULL,
    notifiable_id BIGINT NOT NULL,
    data TEXT NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
`;

export const SQL_DOWN = `DROP TABLE IF EXISTS notifications;
`;

/**
 * Executes the UP migration.
 * @param {object} db - The database client instance with a .query() method.
 * @param {object} [deps={}] - Optional dependencies.
 */
export async function up(db, deps = {}) {
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    console.warn(`db.query not found. Execute manually:
`, SQL_UP);
  }
}

/**
 * Executes the DOWN migration.
 * @param {object} db - The database client instance with a .query() method.
 * @param {object} [deps={}] - Optional dependencies.
 */
export async function down(db, deps = {}) {
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    console.warn(`db.query not found. Execute manually:
`, SQL_DOWN);
  }
}

export default { up, down };
