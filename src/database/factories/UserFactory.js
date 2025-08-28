/* migrated from database/factories/UserFactory.php */

export class UserFactory {
  /**
   * The current password being used by the factory.
   * Equivalent to PHP's protected static ?string $password;
   */
  static _password = null;

  /**
   * Define the model's default state.
   * @param {object} deps - Dependencies like repositories.
   * @returns {object} A plain object with default data.
   */
  static definition(deps = {}) {
    // Equivalent to PHP's static::$password ??= Hash::make('password');
    if (UserFactory._password === null) {
      UserFactory._password = 'password_hashed_placeholder'; // TODO: integrate actual password hashing if needed (e.g., bcrypt.hashSync('password', 10))
    }

    return {
      name: 'John Doe', // TODO: integrate Faker of Node (p.ej. @faker-js/faker). Example: deps.faker?.person.fullName() || 'John Doe'
      email: 'john.doe@example.com', // TODO: integrate Faker of Node (p.ej. @faker-js/faker). Example: deps.faker?.internet.email() || 'john.doe@example.com'
      email_verified_at: new Date().toISOString(), // Equivalent to PHP's now()
      password: UserFactory._password,
      remember_token: Math.random().toString(36).substring(2, 12), // TODO: integrate a robust random string generator similar to Str::random(10)
      // TODO: inyectar repos en deps y crear registros relacionados si aplica
    };
  }

  /**
   * Create a record without persisting it.
   * @param {object} overrides - Data to override default values.
   * @param {object} deps - Dependencies like repositories.
   * @returns {object} A plain object representing the model record.
   */
  static make(overrides = {}, deps = {}) {
    return {
      ...this.definition(deps),
      ...overrides,
    };
  }

  /**
   * Create and persist a record.
   * @param {object} overrides - Data to override default values.
   * @param {object} deps - Dependencies like repositories.
   * @returns {Promise<object>} A promise that resolves to the created model record.
   */
  static async create(overrides = {}, deps = {}) {
    const record = this.make(overrides, deps);
    // TODO: persistir via repositorio si existe, p.ej. deps.userRepo?.create(record)
    return record;
  }
}
