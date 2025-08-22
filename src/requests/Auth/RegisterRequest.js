/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
  const errors = [];

  // name
  if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.length > 255) {
    errors.push({ field: 'name', message: 'Name is required and must be a string less than 255 characters' });
  }

  // email
  if (!req.body.email || typeof req.body.email !== 'string' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email) || req.body.email.length > 255) {
    errors.push({ field: 'email', message: 'Email is required, must be a valid email and less than 255 characters' });
  }
  // TODO: unique:users,email

  // password
  if (!req.body.password || typeof req.body.password !== 'string' || req.body.password.length < 8) {
    errors.push({ field: 'password', message: 'Password is required, must be a string and at least 8 characters' });
  }

  if (!req.body.password_confirmation || req.body.password !== req.body.password_confirmation) {
    errors.push({ field: 'password_confirmation', message: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  } else {
    next();
  }
}

export default { RegisterRequest };