/* migrated from database/migrations/2025_08_19_000001_create_tasks_table.php */

/**
 * SQL for creating the 'tasks' table.
 *
 * @type {string}
 * @constant
 */
export const SQL_UP = `
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- TODO: For MySQL, use AUTO_INCREMENT. For PostgreSQL, GENERATED ALWAYS AS IDENTITY is standard.
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
`;

/**
 * SQL for dropping the 'tasks' table.
 *
 * @type {string}
 * @constant
 */
export const SQL_DOWN = `
DROP TABLE IF EXISTS tasks;
`;

/**
 * Applies the migration, creating the 'tasks' table.
 *
 * @param {object} db - Database client/connection object. Expected to have a `query` method.
 *                      TODO: Replace with actual database client (e.g., 'pg', 'mysql2', 'sqlite3').
 * @param {object} [deps={}] - Optional dependencies.
 * @returns {Promise<void>}
 */
export async function up(db, deps = {}) {
    if (db?.query) {
        await db.query(SQL_UP);
    } else {
        // TODO: Implement database interaction if db.query is not available.
        // For example, log the SQL or use another ORM/query builder.
        console.warn('db.query not found. Manually execute the following SQL to create the tasks table:
', SQL_UP);
    }
}

/**
 * Reverts the migration, dropping the 'tasks' table.
 *
 * @param {object} db - Database client/connection object. Expected to have a `query` method.
 *                      TODO: Replace with actual database client (e.g., 'pg', 'mysql2', 'sqlite3').
 * @param {object} [deps={}] - Optional dependencies.
 * @returns {Promise<void>}
 */
export async function down(db, deps = {}) {
    if (db?.query) {
        await db.query(SQL_DOWN);
    } else {
        // TODO: Implement database interaction if db.query is not available.
        // For example, log the SQL or use another ORM/query builder.
        console.warn('db.query not found. Manually execute the following SQL to drop the tasks table:
', SQL_DOWN);
    }
}

/**
 * Default export containing the up and down migration functions.
 */
export default { up, down };
