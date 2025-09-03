// Auth Controller for Express (ESM)

const users = [];
let nextUserId = 1;

// Simple mock for password hashing. NOT for production use.
const mockHash = (password) => `hashed_${password}`;
const mockCheckHash = (password, hashedPassword) => `hashed_${password}` === hashedPassword;

// A very basic mock for token storage. In a real app, this would be JWT or similar.
// For simplicity, we'll associate a mock token directly with the user for this exercise.

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y password son requeridos.' });
    }

    const existingUser = users.find(u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const newUser = {
      id: nextUserId++,
      name: name,
      email: email.toLowerCase(),
      password: mockHash(password),
    };
    users.push(newUser);

    // Mock a token for the new user
    const token = `mock_token_${newUser.id}_${Date.now()}`;

    return res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email }, token });
  } catch (e) {
    return next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son requeridos.' });
    }

    const user = users.find(u => u.email === email.toLowerCase());

    if (!user || !mockCheckHash(password, user.password)) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    // Mock a token for the logged-in user
    const token = `mock_token_${user.id}_${Date.now()}`;

    return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    return next(e);
  }
}

export async function me(req, res, next) {
  try {
    // Assume req.user is populated by a middleware in a real application
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    // Return a simplified user object, excluding sensitive data like password
    const currentUser = users.find(u => u.id === req.user.id);
    if (!currentUser) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ id: currentUser.id, name: currentUser.name, email: currentUser.email });
  } catch (e) {
    return next(e);
  }
}

export async function logout(req, res, next) {
  try {
    // In a real application, this would invalidate the user's token (e.g., from a blacklist).
    // For this in-memory mock, we just acknowledge the request.
    // We might check req.user to ensure an authenticated user is trying to logout, but for a smoke test, it's fine.
    if (!req.user) {
        // Optionally return 401 if a non-authenticated user tries to logout
        // For this exercise, we'll just indicate success as per Laravel's typical logout flow.
    }
    return res.status(200).json({ message: 'Sesión cerrada' });
  } catch (e) {
    return next(e);
  }
}

export default {
  register,
  login,
  me,
  logout,
};
