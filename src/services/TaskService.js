/* migrated from app/Services/TaskService.php */
export class TaskService {
  /**
   * @param {{ projectRepo: { findById: (id: number) => any; findTasksByProject: (projectId: number) => any}}} deps
   */
  constructor(deps = {}) {
    this.deps = deps;
  }

  async list(project) {
    // TODO: this.deps.projectRepo.findTasksByProject(project.id)
    return this.deps.projectRepo.findTasksByProject(project.id);
  }

  async create(project, data) {
    // TODO: this.deps.projectRepo.createTask
    const task = await this.deps.projectRepo.createTask({
      projectId: project.id,
      title: data.title,
      description: data.description ?? null,
      assignedTo: data.assignedTo ?? null,
      status: "PENDING",
    });
    // TODO: return fresh task from repo
    return task;
  }

  async update(task, data) {
    const oldStatus = task.status;
    // TODO: this.deps.projectRepo.updateTask
    const updatedTask = await this.deps.projectRepo.updateTask(task.id, data);
    async if(data.status && oldStatus !== updatedTask.status) {
      // TODO: this.deps.eventBus?.emit('TaskStatusUpdated', updatedTask)
    }
    // TODO: return fresh task from repo
    return updatedTask;
  }
}

export default { TaskService };