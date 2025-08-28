/* migrated from app/Providers/AppServiceProvider.php */

/**
 * Service provider for registering and booting application-level services.
 * Mimics Laravel's AppServiceProvider for Node.js environments.
 */
export class AppServiceProvider {
  /**
   * Register any application services.
   * This method is where you bind services into the application's service container.
   *
   * @param {object} app The application instance (e.g., a DI container).
   * @param {object} [deps={}] An object containing external dependencies like repositories, eventBus, etc.
   */
  static register(app, deps = {}) {
    /* TODO: registrar servicios, singletons, bindings */
    // Example: app.singleton('UserRepository', () => new InMemoryUserRepository());
    // Example: app.bind('UserService', (app) => new UserService(app.make('UserRepository')));
  }

  /**
   * Bootstrap any application services.
   * This method is called after all other service providers have been registered.
   * Use this for configuration that relies on other registered services, event subscriptions, etc.
   *
   * @param {object} app The application instance (e.g., a DI container).
   * @param {object} [deps={}] An object containing external dependencies like repositories, eventBus, etc.
   */
  static boot(app, deps = {}) {
    /* TODO: hooks post-registro (p.ej. suscribir eventos, casts, macros, políticas) */
    // Example: If deps.eventBus exists, you might subscribe to events here.
    // Example: If app.config exists, you might set global configurations.
  }
}
