/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
  const errors = [];

  // title
  if (!req.body.title || typeof req.body.title !== 'string' || req.body.title.length > 255) {
    errors.push({ field: 'title', message: 'The title field is required and must be a string with max 255 characters' });
  }

  // description
  if (req.body.description && typeof req.body.description !== 'string') {
    errors.push({ field: 'description', message: 'The description field must be a string' });
  }

  // assigned_to
  if (req.body.assigned_to) { // TODO: exists:users,id check
    // Add validation for assigned_to if needed
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { StoreTaskRequest };