/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

export function UpdateTaskRequest(req, res, next) {
  const errors = [];

  if (req.body.title !== undefined && req.body.title.length > 255) {
    errors.push({ field: 'title', message: 'Title must be at most 255 characters' });
  } else if (req.body.title !== undefined && typeof req.body.title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string' });
  }

  if (req.body.description !== undefined && typeof req.body.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  // TODO: Implement proper TaskStatus enum handling
  if (req.body.status !== undefined) {
    // Simple check for now.  Replace with proper enum validation
  }

  // TODO: unique check
  if (req.body.assigned_to !== undefined) {
    // Simple check for now.  Replace with proper exists check
  }

  // status: align with enum (pending | in_progress | done)
  const allowedStatus = ['pending','in_progress','done'];
  if (req.body.status !== undefined && req.body.status !== null) {
    if (typeof req.body.status !== 'string' || !allowedStatus.includes(req.body.status)) {
      errors.push({ field: 'status', message: `Status must be one of ${allowedStatus.join(', ')}.` });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { UpdateTaskRequest };