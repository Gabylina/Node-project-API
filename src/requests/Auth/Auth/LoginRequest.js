/* migrated from app/Http/Requests/Auth/LoginRequest.php */

export function LoginRequest(req, res, next) {
  const errors = [];

  if (!req.body.email) {
    errors.push({ field: 'email', message: 'El campo email es requerido' });
  } else if (typeof req.body.email !== 'string' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
    errors.push({ field: 'email', message: 'El email es inválido' });
  }

  if (!req.body.password) {
    errors.push({ field: 'password', message: 'El campo password es requerido' });
  } else if (typeof req.body.password !== 'string') {
    errors.push({ field: 'password', message: 'La contraseña debe ser una cadena de texto' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { LoginRequest };