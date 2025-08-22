/* migrated from app/Models/Project.php */

export class Project {
  /**
   * @typedef {Object} ProjectProps
   * @property {number} id
   * @property {string} name
   * @property {string} description
   * @property {number} user_id
   * @property {Date} created_at
   * @property {Date} updated_at
   */

  /**
   * @param {ProjectProps} props
   */
  constructor(props) {
    /** @type {number} */
    this.id = props.id;
    /** @type {string} */
    this.name = props.name;
    /** @type {string} */
    this.description = props.description;
    /** @type {number} */
    this.user_id = props.user_id;
    /** @type {Date} */
    this.created_at = props.created_at;
    /** @type {Date} */
    this.updated_at = props.updated_at;

    // TODO: $fillable: ['name','description','user_id']
    // TODO: Add validation
  }

  /**
   * @param {Object} obj
   * @returns {Project | null}
   */
  static from(obj) {
    if (!obj) return null;
    return new Project(obj);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      user_id: this.user_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      // TODO: Implement relations: owner(), tasks()
    };
  }
}

export default { Project };