/* migrated from app/Http/Requests/Auth/LoginRequest.php */

export function LoginRequest(req, res, next) {
  const errors = [];

  if (!req.body.email || typeof req.body.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
    errors.push({ field: 'email', message: 'Email is invalid' });
  }

  if (!req.body.password || typeof req.body.password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  } else {
    next();
  }
}

export default { LoginRequest };