/* migrated from app/Providers/AppServiceProvider.php */

/**
 * Service provider for application-wide services.
 * This class mirrors the Laravel AppServiceProvider, but adapted for Node.js ESM.
 */
export class AppServiceProvider {
  /**
   * Register any application services.
   * This method is intended for registering service bindings, singletons,
   * and initial configuration setup for your application's dependency injection container.
   *
   * @param {object} app - The application container instance (e.g., a DI container).
   * @param {object} [deps={}] - Optional dependencies that might be injected (e.g., config, specific services).
   * @returns {void}
   */
  static register(app, deps = {}) {
    // TODO: Register service bindings, singletons, and initial configuration.
    // Example:
    // app.singleton('ConfigService', () => new ConfigService(deps.configData));
    // app.bind('UserService', () => new UserService(app.make('UserRepository')));
    // app.bind('Logger', () => new LoggerService());
    // For repositories, you might register an interface-to-implementation binding:
    // app.bind('UserRepositoryInterface', 'DbUserRepository');
  }

  /**
   * Bootstrap any application services.
   * This method is intended for global hooks, event subscriptions,
   * defining policies, macros, or any logic that needs to run after
   * all service providers have been registered.
   *
   * @param {object} app - The application container instance (e.g., a DI container).
   * @param {object} [deps={}] - Optional dependencies that might be injected (e.g., eventBus, ORM instances).
   * @returns {void}
   */
  static boot(app, deps = {}) {
    // TODO: Implement global hooks, event subscriptions, custom casts, macros, or policies.
    // Example (if `deps.eventBus` is available):
    // if (deps.eventBus && typeof deps.eventBus.on === 'function') {
    //   deps.eventBus.on('UserRegistered', (user) => {
    //     console.log(`User ${user.name} registered.`);
    //   });
    // }
    // Example (if using an ORM that supports model events/casts):
    // if (deps.orm && deps.orm.defineCast) {
    //   deps.orm.defineCast('date', value => new Date(value));
    // }
  }
}
