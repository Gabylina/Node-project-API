/* migrated from app/Http/Requests/Project/UpdateProjectRequest.php */

export function UpdateProjectRequest(req, res, next) {
  const errors = [];

  if (req.body.name !== undefined && req.body.name !== null) {
    if (typeof req.body.name !== 'string') {
      errors.push({ field: 'name', message: 'The name must be a string.' });
    } else if (req.body.name.length > 255) {
      errors.push({ field: 'name', message: 'The name may not be greater than 255 characters.' });
    }
  }

  if (req.body.description !== undefined && req.body.description !== null) {
    if (typeof req.body.description !== 'string') {
      errors.push({ field: 'description', message: 'The description must be a string.' });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { UpdateProjectRequest };