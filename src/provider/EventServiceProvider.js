/* migrated from app/Providers/EventServiceProvider.php */

export const eventBindings = [
  { event: "ProjectCreated", listeners: ["SendProjectCreatedNotification"] },
  { event: "TaskStatusUpdated", listeners: ["SendTaskStatusNotification"] }
];

export class EventServiceProvider {
  /**
   * Register any application services.
   * @param {object} app The application container/instance.
   * @param {object} deps Additional dependencies (e.g., eventBus, config, logger).
   */
  static register(app, deps = {}) {
    // TODO: registrar servicios, singletons, bindings
    // This provider typically doesn't register much in the `register` phase
    // as its primary role is event subscription in `boot`.
  }

  /**
   * Bootstrap any application services.
   * @param {object} app The application container/instance.
   * @param {object} deps Additional dependencies (e.g., eventBus, config, logger).
   */
  static boot(app, deps = {}) {
    // TODO: hooks post-registro (p.ej. suscribir eventos)

    // Register event listeners based on the eventBindings array.
    // TODO: if (deps.eventBus && typeof deps.eventBus.bind === 'function') {
    //   eventBindings.forEach(({ event, listeners }) => {
    //     listeners.forEach(listener => {
    //       // TODO: resolver el string del listener a una instancia/callable real si aplica
    //       // Example: const listenerInstance = app.make(listener); or resolve from a map
    //       deps.eventBus.bind(event, listener);
    //     });
    //   });
    // }
  }
}
