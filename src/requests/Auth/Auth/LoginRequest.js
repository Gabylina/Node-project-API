/* migrated from app/Http/Requests/Auth/LoginRequest.php */

export function LoginRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Validate 'email'
  if (body.email === undefined || body.email === null || (typeof body.email === 'string' && body.email.trim() === '')) {
    errors.push({ field: 'email', message: 'The email field is required.' });
  } else if (typeof body.email !== 'string' || !/\S+@\S+\.\S+/.test(body.email)) {
    errors.push({ field: 'email', message: 'The email field must be a valid email address.' });
  }

  // Validate 'password'
  if (body.password === undefined || body.password === null || (typeof body.password === 'string' && body.password.trim() === '')) {
    errors.push({ field: 'password', message: 'The password field is required.' });
  } else if (typeof body.password !== 'string') {
    errors.push({ field: 'password', message: 'The password field must be a string.' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { LoginRequest };
