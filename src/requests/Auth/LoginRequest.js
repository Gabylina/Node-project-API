/* migrated from app/Http/Requests/Auth/LoginRequest.php */

export function LoginRequest(req, res, next) {
  const errors = [];

  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    errors.push({ field: 'email', message: 'The email field is required.' });
  } else if (typeof email !== 'string' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    errors.push({ field: 'email', message: 'The email must be a valid email address.' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'The password field is required.' });
  } else if (typeof password !== 'string') {
    errors.push({ field: 'password', message: 'The password must be a string.' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { LoginRequest };