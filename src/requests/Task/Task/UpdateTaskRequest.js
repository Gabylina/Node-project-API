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

  // TODO: handle TaskStatus enum
  if (req.body.status !== undefined && !['todo', 'in progress', 'done'].includes(req.body.status)) {
    errors.push({ field: 'status', message: 'Invalid status' });
  }

  // TODO: unique check
  if (req.body.assigned_to !== undefined) {
    // TODO: exists:users,id check
  }

  if (errors.length > 0) {
    res.status(422).json({ errors });
  } else {
    next();
  }
}

export default { UpdateTaskRequest };