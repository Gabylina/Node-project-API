/* migrated from app/Models/Project.php */

export class Project {
  /**
   * @typedef {Object} ProjectProps
   * @property {number} id
   * @property {string} name
   * @property {string} description
   * @property {number} user_id
   * @property {string} created_at
   * @property {string} updated_at
   */

  /**
   * @param {ProjectProps} props
   */
  constructor(props) {
    // TODO: validar props
    Object.assign(this, { ...this.defaults(), ...props});
  }

  defaults(){
    return {
      description: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Crea una instancia de Project de forma segura.
   * @param {ProjectProps} obj El objeto con el que crear la instancia
   * @returns {Project} Una nueva instancia de Project.
   */
  static from(obj) {
    return new Project(obj);
  }

  /**
   * Convierte el objeto a un objeto plano sin métodos.
   * @returns {ProjectProps} Un objeto plano representando el Project.
   */
  toJSON() {
    const { id, name, description, user_id, created_at, updated_at } = this; // TODO: $hidden
    return { id, name, description, user_id, created_at, updated_at };
  }

  // TODO: owner() - BelongsTo(User)
  // TODO: tasks() - HasMany(Task)
  // TODO: $fillable=['name','description','user_id']
  // TODO: conectar repositorio/persistencia
}

export default { Project };