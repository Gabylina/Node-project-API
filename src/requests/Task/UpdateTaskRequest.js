/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

export function UpdateTaskRequest(req, res, next) {
  const errors = [];

  if (req.body.title && typeof req.body.title !== 'string' || (req.body.title && req.body.title.length > 255)) {
    errors.push({ field: 'title', message: 'The title must be a string with max 255 characters.' });
  }

  if (req.body.description && typeof req.body.description !== 'string') {
    errors.push({ field: 'description', message: 'The description must be a string.' });
  }

  // TODO: Handle TaskStatus enum properly
  if (req.body.status) {
    //Simple check for now.  Needs better enum handling
    //if (!Object.values(TaskStatus).includes(req.body.status)) {
      //errors.push({ field: 'status', message: 'Invalid status.' });
    //} 
  }

  // TODO: unique check
  if (req.body.assigned_to) {
    //Simple check for now. Needs better exists check
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  } else {
    next();
  }
}

export default { UpdateTaskRequest };