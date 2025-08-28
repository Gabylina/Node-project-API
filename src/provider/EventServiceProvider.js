/* migrated from app/Providers/EventServiceProvider.php */

/**
 * Defines the mapping between events and their listeners, migrated from Laravel's $listen property.
 * Each entry specifies an event and an array of listener classes (as strings) that should handle it.
 * 
 * @type {Array<{event: string, listeners: string[]}>}
 */
export const eventBindings = [
    { event: "ProjectCreated", listeners: ["SendProjectCreatedNotification"] },
    { event: "TaskStatusUpdated", listeners: ["SendTaskStatusNotification"] }
];

export class EventServiceProvider {
    /**
     * Register any application services.
     * This method is typically used for binding interfaces to implementations, registering singletons,
     * or performing other foundational service configurations.
     *
     * @param {object} app The application instance, acting as a DI container or service locator.
     * @param {object} [deps={}] Additional dependencies that might be needed during registration (e.g., config).
     */
    static register(app, deps = {}) {
        // TODO: If this provider registered concrete services, singletons, or bindings,
        // they would be defined here. For EventServiceProvider, this method is typically empty
        // as its primary role is event subscription, handled in the `boot` method.
    }

    /**
     * Bootstrap any application services.
     * This method is called after all other service providers have been registered.
     * It's ideal for tasks that depend on other services being available, such as
     * subscribing to events, registering view composers, or setting up global configurations.
     *
     * @param {object} app The application instance, acting as a DI container or service locator.
     * @param {object} [deps={}] Additional dependencies, such as an event bus, repositories, or other services.
     */
    static boot(app, deps = {}) {
        // TODO: If deps.eventBus exists and has a 'bind' method, register the eventBindings.
        // This assumes 'deps.eventBus' is an object that handles event subscriptions.
        // The 'listeners' are expected to be class names (strings) which the eventBus
        // or an associated factory would resolve to actual callable listener instances.
        if (deps.eventBus && typeof deps.eventBus.bind === 'function') {
            eventBindings.forEach(({ event, listeners }) => {
                deps.eventBus.bind(event, listeners);
            });
        }
    }
}
