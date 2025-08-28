/* migrated from database/migrations/2025_08_19_000001_create_tasks_table.php */

export const SQL_UP = `
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: Use AUTO_INCREMENT for MySQL, SERIAL for PostgreSQL */
    project_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'pending',
    assigned_to BIGINT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_tasks_project_id FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);
`.trim();

export const SQL_DOWN = `
DROP TABLE IF EXISTS tasks;
`.trim();

export async function up(db, deps = {}) {
  // TODO: db should be a database client with a .query method (e.g., pg, mysql2, or a custom wrapper).
  // TODO: deps can be used for injecting other services or configurations if needed.
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    console.warn(`db.query not found. Execute manually:
`, SQL_UP);
  }
}

export async function down(db, deps = {}) {
  // TODO: db should be a database client with a .query method.
  // TODO: deps can be used for injecting other services or configurations if needed.
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    console.warn(`db.query not found. Execute manually:
`, SQL_DOWN);
  }
}

export default { up, down };
