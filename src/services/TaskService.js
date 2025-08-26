/* migrated from app/Services/TaskService.php */
export class TaskService {
  /**
   * @param {{ projectRepo: { findById: (id: number) => any, tasks: () => any } }} deps 
   */
  constructor(deps = {}) {
    this.deps = deps;
  }

  async list(project) {
    // TODO: Implement pagination
    return this.deps.projectRepo.tasks(project);
  }

  async create(project, data) {
    const task = await this.deps.projectRepo.createTask(project, {
      title: data.title,
      description: data.description ?? null,
      assigned_to: data.assignedTo ?? null,
      status: 'pending',
    });
    return task;
  }

  async update(task, data) {
    const oldStatus = task.status;
    const updatedTask = await this.deps.projectRepo.updateTask(task, data);

    if ("status" in data && oldStatus !== updatedTask.status) {
      // TODO: this.deps.eventBus?.emit('TaskStatusUpdated', updatedTask)
    }
    return updatedTask;
  }
}

export default { TaskService };