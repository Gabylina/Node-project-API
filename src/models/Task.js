/* migrated from app/Models/Task.php */

/**
 * @typedef {Object} TaskProps
 * @property {number} id
 * @property {string} project_id // TODO: Referencia a Project
 * @property {string} title
 * @property {string} description
 * @property {TaskStatus} status // TODO: Enum TaskStatus
 * @property {number} assigned_to // TODO: Referencia a User
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export class Task {
  /**
   * @param {TaskProps} props
   */
  constructor(props) {
    Object.assign(this, { ...Task.defaults, ...props }); //TODO: defaults
    this.validate();
  }

  /**
   * Crea una instancia de Task, validando los parámetros
   * @param {TaskProps} obj
   * @returns {Task}
   */
  static from(obj) {
    const task = new Task(obj);
    task.validate(); //TODO: más validación
    return task;
  }

  validate(){
    //TODO: validaciones
  }

  toJSON() {
    return {
      id: this.id,
      project_id: this.project_id,
      title: this.title,
      description: this.description,
      status: this.status,
      assigned_to: this.assigned_to,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
  // TODO: Agregar métodos de dominio
  // TODO: project(): obtener instancia de Project (conexión a repositorio)
  // TODO: assignee(): obtener instancia de User (conexión a repositorio)
  // TODO: conectar repositorio/persistencia
  // TODO: $fillable = ['project_id','title','description','status','assigned_to']
  // TODO: $casts = ['status' => TaskStatus::class]
}

Task.defaults = {
  id: null,
  project_id: null,
  title: null,
  description: null,
  status: null,
  assigned_to: null,
  created_at: null,
  updated_at: null,
}


export default { Task };