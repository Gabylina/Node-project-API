/* migrated from app/Listeners/SendProjectCreatedNotification.php */
export class SendProjectCreatedNotification {
  async handle(event, deps = {}) {
    // TODO: Use deps.notifier or similar to send notification
    // Replace with your actual notification logic
    console.log('Project created event received:', event);
    // Example using a hypothetical notification service:
    // await deps.notifier.send(event.project.owner, new ProjectCreatedNotification(event.project));
  }
}

export default { SendProjectCreatedNotification };