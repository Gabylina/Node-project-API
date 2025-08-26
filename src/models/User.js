/* migrated from app/Models/User.php */

/**
 * @typedef {Object} UserProps
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} remember_token
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export class User {
  /** @type {UserProps} */
  #props;

  /**
   * @param {UserProps} props
   */
  constructor(props = {}) {
    // TODO: validar props
    this.#props = this.sanitizeProps(props);
  }

  /**
   * Crea una instancia segura de User a partir de un objeto plano.
   * @param {UserProps} obj El objeto plano con las propiedades del usuario.
   * @returns {User} Una instancia de User.
   */
  static from(obj) {
    return new User(obj);
  }

  /**
   * Devuelve un objeto plano con las propiedades del usuario.
   * @returns {UserProps}
   */
  toJSON() {
    const { id, name, email, password, remember_token, created_at, updated_at } = this.#props; 
    return { id, name, email, password, remember_token, created_at, updated_at };
  }

  /**
   * Filtra las propiedades para incluir sólo las conocidas.
   * @param {UserProps} props
   * @returns {UserProps}
   */
  sanitizeProps(props) {
    const allowedProps = ['id', 'name', 'email', 'password', 'remember_token', 'created_at', 'updated_at'];
    return Object.fromEntries(Object.entries(props).filter(([key]) => allowedProps.includes(key)));
  }

  // TODO: Implementar getters y setters para cada propiedad.
  // TODO: Agregar métodos para manejar relaciones (hasMany/belongsTo).
  // TODO: Implementar lógica para la gestión de contraseñas (e.g., hashing).
  // TODO: $fillable ->  Verificar qué campos se pueden modificar.
  // TODO: $hidden ->  Gestionar los campos que no se deben mostrar.
  // TODO: conectar repositorio/persistencia
}

export default { User };