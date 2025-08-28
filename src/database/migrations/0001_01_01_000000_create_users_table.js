/* migrated from database/migrations/0001_01_01_000000_create_users_table.php */

/**
 * @typedef {object} DatabaseClient
 * @property {(sql: string, params?: any[]) => Promise<any>} query - Function to execute SQL queries.
 */

/**
 * @typedef {object} Dependencies
 * // Add any specific dependencies that might be passed to migrations
 * // Example: logger, configuration, other services
 * // @property {Logger} logger
 */

export const SQL_UP = `
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: For MySQL, use BIGINT AUTO_INCREMENT PRIMARY KEY */
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);

CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL, /* TODO: For PostgreSQL/SQLite, consider using TEXT. LONGTEXT is MySQL specific. */
    last_activity INT NOT NULL,
    CONSTRAINT fk_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_last_activity (last_activity)
);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS users;
`;

/**
 * Runs the migration to create tables.
 * @param {DatabaseClient} db - The database client for executing queries.
 * @param {Dependencies} [deps={}] - Additional dependencies (e.g., logger, config).
 */
export async function up(db, deps = {}) {
  // TODO: Implement actual database schema creation logic here.
  // The 'db' object should have a 'query' method to execute SQL.
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    console.warn('DB client or db.query method not provided. Skipping UP migration SQL execution.');
    // TODO: Handle cases where `db` or `db.query` is not available,
    // perhaps by throwing an error or logging a critical message.
  }
}

/**
 * Reverses the migration by dropping tables.
 * @param {DatabaseClient} db - The database client for executing queries.
 * @param {Dependencies} [deps={}] - Additional dependencies.
 */
export async function down(db, deps = {}) {
  // TODO: Implement actual database schema rollback logic here.
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    console.warn('DB client or db.query method not provided. Skipping DOWN migration SQL execution.');
    // TODO: Handle cases where `db` or `db.query` is not available.
  }
}

export default { up, down };
