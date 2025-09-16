/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
  const errors = [];
  const body = req.body;

  // Validate 'name'
  if (!body.name || (typeof body.name === 'string' && body.name.trim() === '')) {
    errors.push({ field: 'name', message: 'The name field is required.' });
  } else {
    if (typeof body.name !== 'string') {
      errors.push({ field: 'name', message: 'The name must be a string.' });
    }
    if (typeof body.name === 'string' && body.name.length > 255) {
      errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
    }
  }

  // Validate 'email'
  if (!body.email || (typeof body.email === 'string' && body.email.trim() === '')) {
    errors.push({ field: 'email', message: 'The email field is required.' });
  } else {
    if (typeof body.email !== 'string') {
      errors.push({ field: 'email', message: 'The email must be a string.' });
    }
    // Basic email regex (Laravel's is more comprehensive, but this is a good start without external libs)
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (typeof body.email === 'string' && !emailRegex.test(body.email)) {
      errors.push({ field: 'email', message: 'The email must be a valid email address.' });
    }
    if (typeof body.email === 'string' && body.email.length > 255) {
      errors.push({ field: 'email', message: 'The email must not be greater than 255 characters.' });
    }
    // TODO: unique validation for email (e.g., check against a database)
    // if (await userModel.exists({ email: body.email })) {
    //   errors.push({ field: 'email', message: 'The email has already been taken.' });
    // }
  }

  // Validate 'password'
  if (!body.password || (typeof body.password === 'string' && body.password.trim() === '')) {
    errors.push({ field: 'password', message: 'The password field is required.' });
  } else {
    if (typeof body.password !== 'string') {
      errors.push({ field: 'password', message: 'The password must be a string.' });
    }
    if (typeof body.password === 'string' && body.password.length < 8) {
      errors.push({ field: 'password', message: 'The password must be at least 8 characters.' });
    }
    // 'confirmed' rule implies a password_confirmation field
    if (body.password !== body.password_confirmation) {
      errors.push({ field: 'password', message: 'The password confirmation does not match.' });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default { RegisterRequest };
  RegisterRequest,
};
