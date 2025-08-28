/* migrated from database/migrations/0001_01_01_000002_create_jobs_table.php */

/**
 * SQL for creating the 'jobs' table, 'job_batches' table, and 'failed_jobs' table.
 * 
 * NOTE ON ID COLUMNS:
 * - For PostgreSQL, `id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY` is used.
 * - For MySQL, you would typically use `id BIGINT PRIMARY KEY AUTO_INCREMENT`.
 * 
 * NOTE ON TEXT TYPES:
 * - `longText` and `mediumText` from Laravel are mapped to `TEXT` for broader database compatibility (e.g., PostgreSQL).
 * - For MySQL, you might use `LONGTEXT` or `MEDIUMTEXT` respectively for specific storage characteristics.
 * 
 * NOTE ON UNSIGNED INTEGERS:
 * - `unsignedTinyInteger` and `unsignedInteger` from Laravel are mapped to `TINYINT` and `INT`.
 * - `UNSIGNED` is a MySQL-specific keyword. For other databases, the column would just be `INT` or `TINYINT`, 
 *   and the application layer is responsible for ensuring non-negative values if `UNSIGNED` semantics are critical.
 * 
 * NOTE ON INDEXES:
 * - Indexes are created as separate statements after table creation.
 */
export const SQL_UP = `
CREATE TABLE jobs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: Use AUTO_INCREMENT for MySQL */
  queue VARCHAR(255) NOT NULL,
  payload TEXT NOT NULL, /* TODO: Consider LONGTEXT for MySQL */
  attempts TINYINT NOT NULL, /* TODO: Consider UNSIGNED TINYINT for MySQL */
  reserved_at INT NULL, /* TODO: Consider UNSIGNED INT for MySQL */
  available_at INT NOT NULL, /* TODO: Consider UNSIGNED INT for MySQL */
  created_at INT NOT NULL /* TODO: Consider UNSIGNED INT for MySQL */
);

CREATE INDEX jobs_queue_index ON jobs (queue);

CREATE TABLE job_batches (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  total_jobs INT NOT NULL,
  pending_jobs INT NOT NULL,
  failed_jobs INT NOT NULL,
  failed_job_ids TEXT NOT NULL, /* TODO: Consider LONGTEXT for MySQL */
  options TEXT NULL, /* TODO: Consider MEDIUMTEXT for MySQL */
  cancelled_at INT NULL,
  created_at INT NOT NULL,
  finished_at INT NULL
);

CREATE TABLE failed_jobs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: Use AUTO_INCREMENT for MySQL */
  uuid VARCHAR(255) UNIQUE NOT NULL,
  connection TEXT NOT NULL,
  queue TEXT NOT NULL,
  payload TEXT NOT NULL, /* TODO: Consider LONGTEXT for MySQL */
  exception TEXT NOT NULL, /* TODO: Consider LONGTEXT for MySQL */
  failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`;

/**
 * SQL for dropping the 'jobs', 'job_batches', and 'failed_jobs' tables.
 * Tables are dropped in reverse order of creation.
 */
export const SQL_DOWN = `
DROP TABLE IF EXISTS failed_jobs;
DROP TABLE IF EXISTS job_batches;
DROP TABLE IF EXISTS jobs;
`;

/**
 * Runs the database migration to create the 'jobs', 'job_batches', and 'failed_jobs' tables.
 * @param {object} db - The database client instance, expected to have a `query` method.
 * @param {object} [deps={}] - Optional dependencies.
 */
export async function up(db, deps = {}) {
  // TODO: Implement custom logic if db.query is not available or if different SQL dialects are needed.
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    console.warn('Database client does not have a `query` method. Skipping SQL_UP execution.');
  }
}

/**
 * Reverses the database migration by dropping the 'jobs', 'job_batches', and 'failed_jobs' tables.
 * @param {object} db - The database client instance, expected to have a `query` method.
 * @param {object} [deps={}] - Optional dependencies.
 */
export async function down(db, deps = {}) {
  // TODO: Implement custom logic if db.query is not available or if different SQL dialects are needed.
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    console.warn('Database client does not have a `query` method. Skipping SQL_DOWN execution.');
  }
}

export default { up, down };
