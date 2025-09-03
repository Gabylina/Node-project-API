// src/controllers/Auth/index.js

let users = [];
let userIdCounter = 1;
let tokenCounter = 1000;

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y password son requeridos.' });
    }

    const lowerCaseEmail = email.toLowerCase();
    if (users.some(user => user.email === lowerCaseEmail)) {
      return res.status(409).json({ message: 'Este email ya está registrado.' });
    }

    const newUser = {
      id: userIdCounter++,
      name: name,
      email: lowerCaseEmail,
      password: password, // In a real app, this would be hashed.
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    users.push(newUser);

    const token = `mock_token_${tokenCounter++}_user_${newUser.id}`;

    return res.status(201).json({ user: newUser, token: token });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const lowerCaseEmail = email.toLowerCase();
    const user = users.find(u => u.email === lowerCaseEmail);

    if (!user || user.password !== password) { // Simple password check for mock
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = `mock_token_${tokenCounter++}_user_${user.id}`;

    return res.status(200).json({ user: user, token: token });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    return res.status(200).json(req.user);
  } catch (e) {
    next(e);
  }
}

export async function logout(req, res, next) {
  try {
    // In a real application, this would invalidate a token or session.
    // For this mock, we just confirm the action.
    return res.status(200).json({ message: 'Sesión cerrada' });
  } catch (e) {
    next(e);
  }
}

export const __users = users;

export default {
  register,
  login,
  me,
  logout,
};
