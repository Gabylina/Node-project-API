const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;

// Mock hashing functions for password (no actual hashing)
const hash = p => `${p}_hashed`;
const checkHash = (plain, stored) => hash(plain) === stored;

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists (case-insensitive email)
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    const newUser = {
      id: MEM.seq.user++,
      name,
      email: email.toLowerCase(),
      password: hash(password), // Store mocked hashed password
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);

    const token = `mock_token_for_${newUser.email}`;
    return res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (e) {
    return next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !checkHash(password, user.password)) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = `mock_token_for_${user.email}`;
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (e) {
    return next(e);
  }
}

export async function me(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    // Assume req.user contains the authenticated user object with id, name, email
    return res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (e) {
    return next(e);
  }
}

export async function logout(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    // In a real application, this would invalidate the user's token.
    // For this mock, we simply return a success message.
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

export const __users = MEM.users;
