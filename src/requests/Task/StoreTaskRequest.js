/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
  const errors = [];

  // title
  if (!req.body.title) {
    errors.push({ field: 'title', message: 'El campo title es requerido' });
  } else if (typeof req.body.title !== 'string') {
    errors.push({ field: 'title', message: 'El campo title debe ser una cadena de texto' });
  } else if (req.body.title.length > 255) {
    errors.push({ field: 'title', message: 'El campo title no debe superar los 255 caracteres' });
  }

  // description
  if (req.body.description && typeof req.body.description !== 'string') {
    errors.push({ field: 'description', message: 'El campo description debe ser una cadena de texto' });
  }

  // assigned_to
  // TODO: unique check

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { StoreTaskRequest };