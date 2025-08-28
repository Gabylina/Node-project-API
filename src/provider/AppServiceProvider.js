/* migrated from app/Providers/AppServiceProvider.php */

/**
 * Service provider for Node.js applications, inspired by Laravel's AppServiceProvider.
 * This class handles registration of services and booting of global application features.
 * It's designed to be framework-agnostic, using a simple 'app' object for dependency injection.
 */
export class AppServiceProvider {
  /**
   * Register any application services.
   * This method is intended for binding services into the application's dependency injection container
   * and for initial configuration.
   *
   * @param {object} app - The application instance or DI container.
   * @param {object} [deps={}] - An object containing external dependencies (e.g., repositories, eventBus, config).
   * @returns {void}
   */
  static register(app, deps = {}) {
    /* TODO: Registrar servicios, singletons, bindings, y configuración inicial.
     * Ejemplo de uso (asumiendo un simple DI container 'app'):
     *   app.singleton('ConfigService', () => new ConfigService(deps.config));
     *   app.bind('UserService', () => new UserService(app.make('UserRepository')));
     *   app.instance('Logger', deps.logger || console);
     */
  }

  /**
   * Bootstrap any application services.
   * This method is intended for tasks that need to happen after all service providers have been registered,
   * such as registering event listeners, global view composers, custom validation rules, or custom casts.
   *
   * @param {object} app - The application instance or DI container.
   * @param {object} [deps={}] - An object containing external dependencies.
   * @returns {void}
   */
  static boot(app, deps = {}) {
    /* TODO: Hooks post-registro (p.ej. registrar casts, macros, políticas, etc.).
     * Ejemplo de uso:
     *   // if (deps.eventBus) {
     *   //   deps.eventBus.on('UserRegistered', user => console.log(`User ${user.id} registered`));
     *   // }
     *   // app.registerGlobalCast('date', value => value ? new Date(value) : null);
     *   // app.defineMacro('String.prototype.slugify', function() { /* ... * / });
     */
  }
}
