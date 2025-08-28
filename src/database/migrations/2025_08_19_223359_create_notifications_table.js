/* migrated from database/migrations/2025_08_19_223359_create_notifications_table.php */

export const SQL_UP = `
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    notifiable_type VARCHAR(255) NOT NULL,
    notifiable_id BIGINT NOT NULL,
    data JSON NOT NULL, -- TODO: Consider TEXT if your database does not support native JSON type or for broader compatibility.
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
CREATE INDEX notifications_notifiable_type_notifiable_id_index ON notifications (notifiable_type, notifiable_id);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS notifications;
`;

export async function up(db, deps = {}) {
  if (db?.query) await db.query(SQL_UP);
  else console.warn("db.query not found. Execute manually:
", SQL_UP);
}

export async function down(db, deps = {}) {
  if (db?.query) await db.query(SQL_DOWN);
  else console.warn("db.query not found. Execute manually:
", SQL_DOWN);
}

export default { up, down };
