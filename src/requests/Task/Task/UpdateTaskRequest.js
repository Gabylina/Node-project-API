/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

// In a real application, TaskStatus enum values would typically be imported
// from a separate constants or enum definition file. For this migration,
// we define them directly based on common Laravel enum patterns.
const TASK_STATUS_ENUM_VALUES = ['pending', 'in-progress', 'done', 'cancelled'];

/**
 * Express middleware for validating update task requests.
 * Corresponds to Laravel's App\\Http\\Requests\\Task\\UpdateTaskRequest.
 */
export function UpdateTaskRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Rule: 'title' => ['sometimes','string','max:255']
  if ('title' in body) {
    if (typeof body.title !== 'string') {
      errors.push({ field: 'title', message: 'The title must be a string.' });
    } else if (body.title.length > 255) {
      errors.push({ field: 'title', message: 'The title may not be greater than 255 characters.' });
    }
  }

  // Rule: 'description' => ['sometimes','nullable','string']
  if ('description' in body) {
    // If description is present, it can be null or a string.
    if (body.description !== null && typeof body.description !== 'string') {
      errors.push({ field: 'description', message: 'The description must be a string or null.' });
    }
  }

  // Rule: 'status' => ['sometimes','in:'.implode(',', array_column(TaskStatus::cases(), 'value'))]
  if ('status' in body) {
    if (!TASK_STATUS_ENUM_VALUES.includes(body.status)) {
      errors.push({ field: 'status', message: 'The selected status is invalid.' });
    }
  }

  // Rule: 'assigned_to' => ['sometimes','nullable','exists:users,id']
  if ('assigned_to' in body) {
    // If 'assigned_to' is present, it can be null.
    if (body.assigned_to !== null) {
      // If not null, it should be a positive integer ID.
      if (!Number.isInteger(body.assigned_to) || body.assigned_to <= 0) {
        errors.push({ field: 'assigned_to', message: 'The assigned to ID must be a positive integer or null.' });
      } else {
        // TODO: Implement actual database check for existence.
        // This typically requires an asynchronous call to a database or ORM.
        // To keep this middleware synchronous as per "sin dependencias externas"
        // for validation logic, the database check would need to be added
        // by making the middleware async and awaiting the check, or by
        // using a separate pre-validation step that handles async operations.
        // Example (conceptual, requires DB setup and potentially async middleware):
        // const User = await import('../models/User.js'); // Assuming ESM ORM model
        // const user = await User.findById(body.assigned_to);
        // if (!user) {
        //   errors.push({ field: 'assigned_to', message: 'The selected assigned to is invalid.' });
        // }
      }
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { UpdateTaskRequest };
