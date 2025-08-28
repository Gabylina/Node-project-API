/* migrated from database/migrations/2025_08_19_000000_create_projects_table.php */

// Define SQL statements as constants
export const SQL_UP = `
    CREATE TABLE projects (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: For MySQL, use AUTO_INCREMENT */
        user_id BIGINT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL, /* TODO: For very large text, consider specific types like LONGTEXT in MySQL if needed. */
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        CONSTRAINT fk_projects_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`;

export const SQL_DOWN = `
    DROP TABLE IF EXISTS projects;
`;

/**
 * Runs the migration to create tables or modify schema.
 * @param {object} db - Database client object. Expected to have a `query` method (e.g., `db.query('SELECT 1')`).
 * @param {object} [deps={}] - Optional dependencies. This object could contain other services or configurations.
 */
export async function up(db, deps = {}) {
    console.log('Running up migration for create_projects_table...');
    // TODO: Implement transaction management if your database client supports it and it's desired.
    if (db?.query) {
        await db.query(SQL_UP);
        console.log('Table "projects" created successfully.');
    } else {
        console.warn('DB client or db.query method not available. Cannot execute SQL_UP.');
        // TODO: Provide alternative execution or detailed logging if `db.query` is not present.
    }
}

/**
 * Reverts the migration, dropping tables or reversing schema changes.
 * @param {object} db - Database client object. Expected to have a `query` method.
 * @param {object} [deps={}] - Optional dependencies.
 */
export async function down(db, deps = {}) {
    console.log('Running down migration for create_projects_table...');
    // TODO: Implement transaction management if your database client supports it and it's desired.
    if (db?.query) {
        await db.query(SQL_DOWN);
        console.log('Table "projects" dropped successfully.');
    } else {
        console.warn('DB client or db.query method not available. Cannot execute SQL_DOWN.');
        // TODO: Provide alternative execution or detailed logging if `db.query` is not present.
    }
}

// Default export for migration runner tools
export default { up, down };
