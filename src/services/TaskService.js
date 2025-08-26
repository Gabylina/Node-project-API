/* migrated from app/Services/TaskService.php */
export class TaskService {
  constructor(deps = {}) {
    this.deps = deps;
  }

  /**
   * @param {Project} project
   * @returns {Promise<any>}
   */
  async list(project) {
    // TODO: Implement pagination
    return this.deps.taskRepo.findAllByProject(project);
  }

  /**
   * @param {Project} project
   * @param {Object} data
   * @returns {Promise<Task>}
   */
  async create(project, data) {
    const task = await this.deps.taskRepo.create({
      title: data.title,
      description: data.description ?? null,
      assigned_to: data.assignedTo ?? null,
      status: "PENDING",
    }, project);
    return task;
  }

  /**
   * @param {Task} task
   * @param {Object} data
   * @returns {Promise<Task>}
   */
  async update(task, data) {
    const oldStatus = task.status;
    const updatedTask = await this.deps.taskRepo.update(task, data);
    if ("status" in data && oldStatus !== updatedTask.status) {
      // TODO: this.deps.eventBus?.emit('TaskStatusUpdated', updatedTask)
    }
    return updatedTask;
  }
}

export default { TaskService };