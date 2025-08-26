/* migrated from app/Services/ProjectService.php */
export class ProjectService {
  constructor(deps = {}) {
    this.deps = deps;
  }

  /**
   * @param {User} user
   * @returns {Promise<object>} 
   */
  async listFor(user) {
    // TODO: this.deps.projectRepo.listForUser(user)
    return {}; // TODO: Pagination
  }

  /**
   * @param {User} user
   * @param {object} data
   * @returns {Promise<object>} 
   * @throws {Error} 
   */
  async createFor(user, data) {
    if (!data.name) {
      throw new Error('Name is required');
    }
    const project = await this.deps.projectRepo.create({
      user_id: user.id,
      name: data.name,
      description: data.description,
    });

    // TODO: this.deps.eventBus?.emit('ProjectCreated', project)
    // TODO: this.deps.projectRepo.findById(project.id) to get fresh data 
    return project;
  }

  /**
   * @param {Project} project
   * @param {object} data
   * @returns {Promise<object>}
   * @throws {Error}
   */
  async update(project, data) {
    if (!project) {
      throw new Error('Project not found');
    }
    await this.deps.projectRepo.update(project.id, data);
    // TODO: this.deps.projectRepo.findById(project.id) to get fresh data 
    return project;
  }
}

export default { ProjectService };