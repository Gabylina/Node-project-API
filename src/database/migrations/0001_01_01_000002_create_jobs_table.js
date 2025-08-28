/* migrated from database/migrations/0001_01_01_000002_create_jobs_table.php */

/**
 * @typedef {object} DbClient
 * @property {(sql: string, params?: any[]) => Promise<any>} query
 * @property {() => Promise<void>} connect
 * @property {() => Promise<void>} end
 * // Add other database client methods as needed
 */

/**
 * @typedef {object} Dependencies
 * // Add any required dependencies here
 */

export const SQL_UP = `
CREATE TABLE jobs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: For MySQL, use BIGINT AUTO_INCREMENT PRIMARY KEY */
  queue VARCHAR(255) NOT NULL,
  payload LONGTEXT NOT NULL, /* TODO: For PostgreSQL/general SQL, consider TEXT or specify max length if LONGTEXT is not supported. */
  attempts TINYINT UNSIGNED NOT NULL, /* TODO: For PostgreSQL/general SQL, consider SMALLINT or INT, as UNSIGNED TINYINT might be MySQL-specific. */
  reserved_at INT UNSIGNED NULL, /* TODO: For PostgreSQL/general SQL, consider INT, as UNSIGNED INT might be MySQL-specific. */
  available_at INT UNSIGNED NOT NULL, /* TODO: For PostgreSQL/general SQL, consider INT, as UNSIGNED INT might be MySQL-specific. */
  created_at INT UNSIGNED NOT NULL /* TODO: For PostgreSQL/general SQL, consider INT, as UNSIGNED INT might be MySQL-specific. */
);

CREATE INDEX jobs_queue_index ON jobs (queue);

CREATE TABLE job_batches (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  total_jobs INT NOT NULL,
  pending_jobs INT NOT NULL,
  failed_jobs INT NOT NULL,
  failed_job_ids LONGTEXT NOT NULL, /* TODO: For PostgreSQL/general SQL, consider TEXT or specify max length if LONGTEXT is not supported. */
  options MEDIUMTEXT NULL, /* TODO: For PostgreSQL/general SQL, consider TEXT or specify max length if MEDIUMTEXT is not supported. */
  cancelled_at INT NULL,
  created_at INT NOT NULL,
  finished_at INT NULL
);

CREATE TABLE failed_jobs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: For MySQL, use BIGINT AUTO_INCREMENT PRIMARY KEY */
  uuid VARCHAR(255) UNIQUE NOT NULL,
  connection TEXT NOT NULL,
  queue TEXT NOT NULL,
  payload LONGTEXT NOT NULL, /* TODO: For PostgreSQL/general SQL, consider TEXT or specify max length if LONGTEXT is not supported. */
  exception LONGTEXT NOT NULL, /* TODO: For PostgreSQL/general SQL, consider TEXT or specify max length if LONGTEXT is not supported. */
  failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS job_batches;
DROP TABLE IF EXISTS failed_jobs;
`;

/**
 * Executes the 'up' migration.
 * @param {DbClient} db - The database client for query execution.
 * @param {Dependencies} [deps={}] - Additional dependencies.
 */
export async function up(db, deps = {}) {
  // TODO: Add robust transaction handling if db client supports it.
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    console.warn(`db.query not found. Execute manually:
`, SQL_UP);
  }
}

/**
 * Executes the 'down' migration.
 * @param {DbClient} db - The database client for query execution.
 * @param {Dependencies} [deps={}] - Additional dependencies.
 */
export async function down(db, deps = {}) {
  // TODO: Add robust transaction handling if db client supports it.
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    console.warn(`db.query not found. Execute manually:
`, SQL_DOWN);
  }
}

export default { up, down };
