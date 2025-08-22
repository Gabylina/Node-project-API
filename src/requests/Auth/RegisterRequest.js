/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
  const errors = [];

  // name
  if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.length > 255) {
    errors.push({ field: 'name', message: 'The name field is required and must be a string less than 255 characters' });
  }

  // email
  if (!req.body.email || typeof req.body.email !== 'string' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email) || req.body.email.length > 255) {
    errors.push({ field: 'email', message: 'The email field is required, must be a valid email, and must be less than 255 characters' });
  }
  // TODO: unique check for email

  // password
  if (!req.body.password || typeof req.body.password !== 'string' || req.body.password.length < 8) {
    errors.push({ field: 'password', message: 'The password field is required and must be at least 8 characters' });
  }
  if (!req.body.password_confirmation || req.body.password !== req.body.password_confirmation) {
    errors.push({ field: 'password_confirmation', message: 'The password confirmation does not match' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  } else {
    next();
  }
}

export default { RegisterRequest };