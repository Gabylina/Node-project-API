// This module provides authentication handlers for Express.js (ESM).

const users = [];
let nextUserId = 1;

// Simple "hashing" and comparison for mock purposes, as no external libs are allowed.
const hashPassword = (password) => password + '_hashed';
const checkPassword = (plainPassword, hashedPassword) => (plainPassword + '_hashed') === hashedPassword;

const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Basic mock validation for unique email
    if (users.some(u => u.email === email.toLowerCase())) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    const newUser = {
      id: nextUserId++,
      name,
      email: email.toLowerCase(),
      password: hashPassword(password),
    };
    users.push(newUser);

    const token = generateToken();

    // Remove password before sending to client
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({ user: userWithoutPassword, token });
  } catch (e) {
    return next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    const user = users.find(u => u.email === email.toLowerCase());

    if (!user || !checkPassword(password, user.password)) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken();

    // Remove password before sending to client
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (e) {
    return next(e);
  }
}

export async function me(req, res, next) {
  try {
    // An authentication middleware would populate req.user
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    // For this mock, req.user is assumed to be a user object without password
    return res.status(200).json(req.user);
  } catch (e) {
    return next(e);
  }
}

export async function logout(req, res, next) {
  try {
    // Token invalidation is a client-side concern for this mock
    return res.status(200).json({ message: 'Sesión cerrada' });
  } catch (e) {
    return next(e);
  }
}

// Export the internal mock array for testing or other controllers to reuse
export const __users = users;

// Group all handlers for default export
export default {
  register,
  login,
  me,
  logout,
};
