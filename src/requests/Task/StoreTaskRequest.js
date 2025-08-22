/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
  const errors = [];

  // title
  if (!req.body.title || typeof req.body.title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required and must be a string' });
  } else if (req.body.title.length > 255) {
    errors.push({ field: 'title', message: 'Title must be 255 characters or less' });
  }

  // description
  if (req.body.description && typeof req.body.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  // assigned_to
  if (req.body.assigned_to) {
    // TODO: unique check
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { StoreTaskRequest };