/* migrated from app/Listeners/SendTaskStatusNotification.php */
export class SendTaskStatusNotification {
  async handle(event, deps = {}) {
    const task = await deps.taskRepo.find(event.taskId);
    const project = await deps.projectRepo.find(task.projectId);
    const owner = await deps.userRepo.find(project.ownerId);

    if (task.assigneeId) {
      const assignee = await deps.userRepo.find(task.assigneeId);
      // TODO: Use deps.notifier.send(assignee, new TaskStatusChangedNotification(task));
    }

    // TODO: Use deps.notifier.send(owner, new TaskStatusChangedNotification(task));
  }
}

export default { SendTaskStatusNotification };