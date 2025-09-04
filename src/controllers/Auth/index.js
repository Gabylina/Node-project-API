const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;

// Mock hashing function, as external libraries are forbidden.
const hash = p => `${p}_hashed`;

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
    }

    const lowerEmail = email.toLowerCase();

    if (users.some(u => u.email === lowerEmail)) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const newUser = {
      id: MEM.seq.user++,
      name,
      email: lowerEmail,
      password: hash(password), // Storing mock hashed password
    };
    users.push(newUser);

    const token = `mock_token_for_${lowerEmail}`;
    return res.status(201).json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token
    });
  } catch (e) {
    return next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    const lowerEmail = email.toLowerCase();
    const user = users.find(u => u.email === lowerEmail);

    if (!user || hash(password) !== user.password) { // Mock password check
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = `mock_token_for_${lowerEmail}`;
    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
      token
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
    // Expose only safe user data, without password
    return res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      }
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
    // In a real application, token invalidation would happen here.
    // For this mock, we just confirm the action.
    return res.status(200).json({ message: 'Sesión cerrada' });
  } catch (e) {
    return next(e);
  }
}

// Export the shared memory array alias
export const __users = MEM.users;

export default {
  register,
  login,
  me,
  logout,
};
