const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;

// Simple hash function for mock purposes
const hash = p => `${p}_hashed`;

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: name, email, password' });
    }

    const lowerEmail = email.toLowerCase();
    if (users.find(u => u.email === lowerEmail)) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const newUser = {
      id: MEM.seq.user++,
      name,
      email: lowerEmail,
      password: hash(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);

    const token = `mock_token_for_${lowerEmail}`;
    return res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email }, token });
  } catch (e) {
    return next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: email, password' });
    }

    const lowerEmail = email.toLowerCase();
    const user = users.find(u => u.email === lowerEmail);

    if (!user || user.password !== hash(password)) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = `mock_token_for_${lowerEmail}`;
    return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    return next(e);
  }
}

export async function me(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    // Assume req.user is populated by an authentication middleware
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        // This case indicates req.user was set for a non-existent user, handle as unauthorized
        return res.status(401).json({ message: 'Usuario no encontrado o no autenticado' });
    }
    return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    return next(e);
  }
}

export async function logout(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    // In a real application, token invalidation logic would go here.
    // For this mock implementation, we just confirm logout.
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
