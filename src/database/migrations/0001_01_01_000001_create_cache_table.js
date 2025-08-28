/* migrated from database/migrations/0001_01_01_000001_create_cache_table.php */

/**
 * SQL to create the 'cache' and 'cache_locks' tables.
 * 
 * NOTE ON TYPES:
 * - VARCHAR(255) is a common default for strings without explicit length in Laravel. Adjust if your database needs a different default or max length.
 * - MEDIUMTEXT is a MySQL-specific type. For PostgreSQL or SQLite, consider using TEXT.
 * - INTEGER is a standard type.
 * - PRIMARY KEY implies NOT NULL.
 * - For other columns, NOT NULL is implied by Laravel's default column definitions unless `->nullable()` is chained.
 */
export const SQL_UP = `
CREATE TABLE cache (
    key VARCHAR(255) PRIMARY KEY,
    value MEDIUMTEXT NOT NULL, -- TODO: For PostgreSQL/SQLite, consider using TEXT instead of MEDIUMTEXT.
    expiration INTEGER NOT NULL
);

CREATE TABLE cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);
`;

/**
 * SQL to drop the 'cache' and 'cache_locks' tables if they exist.
 */
export const SQL_DOWN = `
DROP TABLE IF EXISTS cache;
DROP TABLE IF EXISTS cache_locks;
`;

/**
 * Runs the migration to create the cache tables.
 * @param {object} db - The database client instance, expected to have a 'query' method.
 * @param {object} [deps={}] - An object for dependency injection (e.g., logger, config).
 */
export async function up(db, deps = {}) {
  // TODO: Implement custom logic here if raw SQL is not sufficient or if 'db.query' is not available.
  // Example: Use a specific ORM or query builder if not using raw SQL directly.
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    console.warn('DB client does not have a .query method. Please execute SQL_UP manually or provide a compatible db object.');
    // TODO: Add more robust error handling or alternative execution here.
  }
}

/**
 * Reverses the migration by dropping the cache tables.
 * @param {object} db - The database client instance, expected to have a 'query' method.
 * @param {object} [deps={}] - An object for dependency injection.
 */
export async function down(db, deps = {}) {
  // TODO: Implement custom logic here if raw SQL is not sufficient or if 'db.query' is not available.
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    console.warn('DB client does not have a .query method. Please execute SQL_DOWN manually or provide a compatible db object.');
    // TODO: Add more robust error handling or alternative execution here.
  }
}

export default { up, down };
