/* migrated from app/Http/Requests/Project/StoreProjectRequest.php */

export function StoreProjectRequest(req, res, next) {
  const errors = [];

  // name
  if (!req.body.name) {
    errors.push({ field: 'name', message: 'The name field is required.' });
  } else if (typeof req.body.name !== 'string') {
    errors.push({ field: 'name', message: 'The name must be a string.' });
  } else if (req.body.name.length > 255) {
    errors.push({ field: 'name', message: 'The name may not be greater than 255 characters.' });
  }

  // description
  if (req.body.description && typeof req.body.description !== 'string') {
    errors.push({ field: 'description', message: 'The description must be a string.' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { StoreProjectRequest };