/* migrated from app/Services/ProjectService.php */
export class ProjectService {
  constructor(deps = {}) {
    this.deps = deps;
  }

  /**
   * @param {User} user
   * @returns {Promise<object>} Pagination object
   */
  async listFor(user) {
    // TODO: this.deps.projectRepo.listFor(user, {paginate: {limit: 10, sort: '-createdAt'}})
    return {
      data: [],
      meta: {}
    };
  }

  /**
   * @param {User} user
   * @param {object} data
   * @returns {Promise<object>} Created project
   * @throws {Error} If project creation fails
   */
  async createFor(user, data) {
    if (!data.name) {
      throw new Error('Project name is required');
    }
    const project = await this.deps.projectRepo.create({
      user_id: user.id,
      name: data.name,
      description: data.description || null
    });
    // TODO: this.deps.eventBus?.emit('ProjectCreated', project)
    return project; // TODO: this.deps.projectRepo.findById(project.id)
  }

  /**
   * @param {Project} project
   * @param {object} data
   * @returns {Promise<object>} Updated project
   * @throws {Error} If project update fails
   */
  async update(project, data) {
    // TODO: this.deps.projectRepo.update(project.id, data);
    return this.deps.projectRepo.findById(project.id);
  }
}

export default { ProjectService };