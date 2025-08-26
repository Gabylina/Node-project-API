/* migrated from app/Services/ProjectService.php */
export class ProjectService {
  constructor(deps = {}) {
    this.deps = deps;
  }

  /**
   * @param {User} user
   * @returns {Promise<Object>} 
   */
  async listFor(user) {
    // TODO: Implementar paginación
    const projects = await this.deps.projectRepo.findFor(user);
    return projects;
  }

  /**
   * @param {User} user
   * @param {Object} data
   * @returns {Promise<Object>} 
   */
  async createFor(user, data) {
    const project = await this.deps.projectRepo.create({
      userId: user.id,
      name: data.name,
      description: data.description || null,
    });

    // TODO: this.deps.eventBus?.emit('ProjectCreated', project)
    return project;
  }

  /**
   * @param {Project} project
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(project, data) {
    try {
      const updatedProject = await this.deps.projectRepo.update(project, data);
      return updatedProject;
    } catch (error) {
      throw new Error('Failed to update project');
    }
  }
}

export default { ProjectService };