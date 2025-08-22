/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
  const errors = [];

  const rules = {
    name: ['required', 'string', 'max:255'],
    email: ['required', 'email', 'max:255', 'unique:users,email'],
    password: ['required', 'string', 'min:8', 'confirmed'],
  };

  for (const field in rules) {
    const validators = rules[field];
    const value = req.body[field];

    for (const validator of validators) {
      switch (validator) {
        case 'required':
          if (value === undefined || value === null || value.toString().trim() === '') {
            errors.push({ field, message: `${field} is required` });
          }
          break;
        case 'string':
          if (typeof value !== 'string') {
            errors.push({ field, message: `${field} must be a string` });
          }
          break;
        case 'email':
          if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
            errors.push({ field, message: `${field} must be a valid email` });
          }
          break;
        case 'max:255':
          if (value.length > 255) {
            errors.push({ field, message: `${field} must be less than 255 characters` });
          }
          break;
        case 'min:8':
          if (value.length < 8) {
            errors.push({ field, message: `${field} must be at least 8 characters` });
          }
          break;
        case 'confirmed':
          if (value !== req.body['password_confirmation']) {
            errors.push({ field: 'password', message: 'Passwords do not match' });
          }
          break;
        case 'unique:users,email':
          // TODO: unique check
          break;
      }
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  } else {
    next();
  }
}

export default { RegisterRequest };