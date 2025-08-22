/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
  const errors = [];

  // title validations
  if (!req.body.title) {
    errors.push({ field: 'title', message: 'The title field is required' });
  } else if (typeof req.body.title !== 'string') {
    errors.push({ field: 'title', message: 'The title must be a string' });
  } else if (req.body.title.length > 255) {
    errors.push({ field: 'title', message: 'The title may not be greater than 255 characters' });
  }

  // description validations
  if (req.body.description && typeof req.body.description !== 'string') {
    errors.push({ field: 'description', message: 'The description must be a string' });
  }

  // assigned_to validations
  if (req.body.assigned_to) { //Basic check, improve as needed
    // TODO: Add exists:users,id validation
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { StoreTaskRequest };