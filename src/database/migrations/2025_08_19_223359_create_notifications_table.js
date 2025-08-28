/* migrated from database/migrations/2025_08_19_223359_create_notifications_table.php */

/**
 * SQL for creating the 'notifications' table.
 * 
 * Columns:
 * - `id`: UUID, Primary Key. Unique identifier for the notification.
 * - `type`: VARCHAR(255), NOT NULL. The class name of the notification.
 * - `notifiable_type`: VARCHAR(255), NOT NULL. The polymorphic type of the entity that owns the notification.
 * - `notifiable_id`: BIGINT, NOT NULL. The ID of the entity that owns the notification. 
 *     (TODO: In MySQL, this is typically BIGINT UNSIGNED. Adjust type if using MySQL and need unsigned integer ranges).
 * - `data`: TEXT, NOT NULL. The JSON payload of the notification.
 * - `read_at`: TIMESTAMP NULL. Timestamp when the notification was marked as read.
 * - `created_at`: TIMESTAMP NULL. Timestamp when the notification was created.
 * - `updated_at`: TIMESTAMP NULL. Timestamp when the notification was last updated.
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

/**
 * SQL for dropping the 'notifications' table.
 */
export const SQL_DOWN = `
DROP TABLE IF EXISTS notifications;
`;

/**
 * Runs the migration to create the 'notifications' table.
 * @param {object} db - Database connection object, expected to have a `query` method.
 * @param {object} [deps={}] - Dependencies object (currently unused).
 */
export async function up(db, deps = {}) {
  // TODO: Add transaction handling if supported by your 'db' object and desired.
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    // eslint-disable-next-line no-console
    console.warn('DB object or db.query method not provided. Skipping UP migration for notifications table.');
    // TODO: Implement custom logic if db.query is not available, e.g., throw an error or use a different ORM/query builder.
  }
}

/**
 * Reverses the migration by dropping the 'notifications' table.
 * @param {object} db - Database connection object, expected to have a `query` method.
 * @param {object} [deps={}] - Dependencies object (currently unused).
 */
export async function down(db, deps = {}) {
  // TODO: Add transaction handling if supported by your 'db' object and desired.
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    // eslint-disable-next-line no-console
    console.warn('DB object or db.query method not provided. Skipping DOWN migration for notifications table.');
    // TODO: Implement custom logic if db.query is not available.
  }
}

export default { up, down };
