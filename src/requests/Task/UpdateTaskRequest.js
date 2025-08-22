/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

export function UpdateTaskRequest(req, res, next) {
  const errors = [];

  const rules = {
    title: ['sometimes', 'string', 'max:255'],
    description: ['sometimes', 'nullable', 'string'],
    status: ['sometimes', 'in:todo,inprogress,done'],
    assigned_to: ['sometimes', 'nullable', 'exists:users,id'],
  };

  for (const [field, validations] of Object.entries(rules)) {
    if (!req.body.hasOwnProperty(field) && validations.includes('sometimes')) continue;

    const value = req.body[field];

    for (const validation of validations) {
      if (validation === 'required' && (value === undefined || value === null || value.toString().trim() === '')) {
        errors.push({ field, message: `${field} is required` });
        break;
      }
      if (validation === 'string' && typeof value !== 'string') {
        errors.push({ field, message: `${field} must be a string` });
        break;
      }
      if (validation === 'max:255' && typeof value === 'string' && value.length > 255) {
        errors.push({ field, message: `${field} must be at most 255 characters` });
        break;
      }
      if (validation === 'nullable' && value !== null && value !== undefined) continue;
      if (validation.startsWith('in:')) {
        const allowedValues = validation.substring('in:'.length).split(',');
        if (!allowedValues.includes(value)) {
          errors.push({ field, message: `${field} must be one of ${allowedValues.join(', ')}` });
          break;
        }
      }
      if (validation.startsWith('exists:') && validation.endsWith('id')) {
          // TODO: unique check
      }
      // Add more validation types as needed
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  } else {
    next();
  }
}

export default { UpdateTaskRequest };