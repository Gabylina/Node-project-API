/* migrated from database/migrations/2025_08_19_223359_create_notifications_table.php */

/**
 * @typedef {object} Database
 * @property {(sql: string, params?: any[]) => Promise<any>} query
 * TODO: Replace with your actual DB client interface.
 */

/**
 * @typedef {object} Dependencies
 * TODO: Add any necessary dependencies for your migrations.
 */

export const SQL_UP = `
CREATE TABLE notifications (
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

export const SQL_DOWN = `
DROP TABLE IF EXISTS notifications;
`;

/**
 * Run the migrations.
 * @param {Database} db - The database client.
 * @param {Dependencies} [deps] - Additional dependencies.
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
 * Reverse the migrations.
 * @param {Database} db - The database client.
 * @param {Dependencies} [deps] - Additional dependencies.
 */
export async function down(db, deps = {}) {
    if (db?.query) {
        await db.query(SQL_DOWN);
    } else {
        console.warn(`db.query not found. Execute manually:
`, SQL_DOWN);
    n    }
}

export default { up, down };
