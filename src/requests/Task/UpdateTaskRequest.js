/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

export function UpdateTaskRequest(req, res, next) {
  const errors = [];

  const rules = {
    title: ['sometimes', 'string', 'max:255'],
    description: ['sometimes', 'nullable', 'string'],
    status: ['sometimes', 'in:pending,inprogress,completed'],
    assigned_to: ['sometimes', 'nullable', 'exists:users,id'],
  };

  for (const field in rules) {
    const value = req.body[field];
    const ruleSet = rules[field];

    for (const rule of ruleSet) {
      const parts = rule.split(':');
      const ruleName = parts[0];
      const ruleValue = parts[1];

      switch (ruleName) {
        case 'sometimes':
          if (value === undefined && ruleSet.length === 1) break;
          if (value !== undefined && (value === null || value === '')) {
              errors.push({ field, message: `${field} is required` });
              break;
          }
          break;
        case 'required':
          if (value === undefined || value === null || value === '') {
            errors.push({ field, message: `${field} is required` });
          }
          break;
        case 'string':
          if (typeof value !== 'string') {
            errors.push({ field, message: `${field} must be a string` });
          }
          break;
        case 'max':
          if (typeof value === 'string' && value.length > ruleValue) {
            errors.push({ field, message: `${field} must be less than ${ruleValue} characters` });
          }
          break;
        case 'in':
          if(typeof value !== 'string' || !ruleValue.split(',').includes(value)) {
            errors.push({ field, message: `${field} must be one of ${ruleValue}` });
          }
          break;
        case 'nullable':
          break; 
        case 'email':
          if (typeof value !== 'string' || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            errors.push({ field, message: `${field} must be a valid email` });
          }
          break;
        case 'exists':
          // TODO: unique check
          break;
        case 'date':
          if (typeof value !== 'string' || !Date.parse(value)){
            errors.push({ field, message: `${field} must be a valid date` });
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push({ field, message: `${field} must be a boolean` });
          }
          break;
        case 'integer':
          if (typeof value !== 'number' || !Number.isInteger(value)) {
            errors.push({ field, message: `${field} must be an integer` });
          }
          break;
      }
      if (errors.length > 0) break;
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  } else {
    next();
  }
}

export default { UpdateTaskRequest };