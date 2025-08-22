/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
  const errors = [];

  // title
  if (!req.body.title) {
    errors.push({ field: 'title', message: 'El campo title es requerido' });
  } else if (typeof req.body.title !== 'string') {
    errors.push({ field: 'title', message: 'El campo title debe ser un string' });
  } else if (req.body.title.length > 255) {
    errors.push({ field: 'title', message: 'El campo title no debe superar los 255 caracteres' });
  }

  // description
  if (req.body.description && typeof req.body.description !== 'string') {
    errors.push({ field: 'description', message: 'El campo description debe ser un string' });
  }

  // assigned_to
  // TODO: unique check
  if (req.body.assigned_to && typeof req.body.assigned_to !== 'string') {
    errors.push({ field: 'assigned_to', message: 'El campo assigned_to debe ser un string' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { StoreTaskRequest };