/* migrated from database/migrations/2025_08_19_172738_create_personal_access_tokens_table.php */

export const SQL_UP = `
CREATE TABLE personal_access_tokens (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- TODO: For MySQL, consider AUTO_INCREMENT instead of GENERATED ALWAYS AS IDENTITY.
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL, -- TODO: For MySQL, consider BIGINT UNSIGNED for consistency with Laravel's default morphs.
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id)
);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS personal_access_tokens;
`;

export async function up(db, deps = {}) {
  // TODO: Add logging or specific SQL dialect handling if needed based on `deps`.
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    console.warn('DB connection or query method not available. Cannot execute SQL_UP.');
    // TODO: Handle the case where db.query is not available, e.g., throw an error or use a fallback.
  }
}

export async function down(db, deps = {}) {
  // TODO: Add logging or specific SQL dialect handling if needed based on `deps`.
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    console.warn('DB connection or query method not available. Cannot execute SQL_DOWN.');
    // TODO: Handle the case where db.query is not available, e.g., throw an error or use a fallback.
  }
}

export default { up, down };
