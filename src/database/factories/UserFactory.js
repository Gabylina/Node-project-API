/* migrated from database/factories/UserFactory.php */

export class UserFactory {
  /**
   * Define the model's default state.
   *
   * @param {object} deps - Dependencies like repositories or services.
   * @returns {object} An object with default data for a User.
   */
  static definition(deps = {}) {
    // PHP's `now()` typically returns a Carbon instance that serializes to an ISO 8601 string in the database.
    const now = new Date().toISOString();

    // PHP's `static::$password ??= Hash::make('password')` memoizes a hashed password.
    // Since the hashing itself is a TODO, we use a placeholder value.
    // If a full hashing implementation were present, a static private field could mimic the memoization.

    return {
      name: 'John Doe', // TODO: integrar Faker de Node (p.ej. @faker-js/faker)
      email: 'john.doe@example.com', // TODO: integrar Faker de Node (p.ej. @faker-js/faker)
      email_verified_at: now,
      password: 'hashed-password-placeholder', // TODO: generar hash de 'password' si es necesario, o usar librería de hashing. Laravel usa bcrypt.
      remember_token: 'random_string', // TODO: generar string aleatorio de 10 caracteres
    };
  }

  /**
   * Create a model instance without persisting it.
   *
   * @param {object} overrides - Attributes to override the default definition.
   * @param {object} deps - Dependencies for the factory (e.g., other factories, services).
   * @returns {object} A plain object representing the model data.
   */
  static make(overrides = {}, deps = {}) {
    return { ...this.definition(deps), ...overrides };
  }

  /**
   * Create a model instance and persist it (via a repository if provided).
   *
   * @param {object} overrides - Attributes to override the default definition.
   * @param {object} deps - Dependencies for the factory (e.g., repositories, services).
   * @returns {Promise<object>} A promise that resolves to the created and persisted record.
   */
  static async create(overrides = {}, deps = {}) {
    const record = this.make(overrides, deps);
    // TODO: persistir via repositorio si existe, p.ej. deps.userRepo?.create(record)
    // TODO: inyectar repos en deps y crear registros relacionados si aplica
    return record;
  }
}
