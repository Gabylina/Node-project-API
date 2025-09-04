const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;

// Mock password hashing for in-memory storage
const hashPassword = p => `${p}_hashed`;
const checkPassword = (plain, hashed) => hashPassword(plain) === hashed;

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos requeridos: name, email, password.' });
    }

    const lowerEmail = email.toLowerCase();
    if (users.some(user => user.email === lowerEmail)) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const newUser = {
      id: MEM.seq.user++,
      name,
      email: lowerEmail,
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);

    const token = `mock_token_for_${lowerEmail}`;
    return res.status(201).json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (e) {
    return next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan campos requeridos: email, password.' });
    }

    const lowerEmail = email.toLowerCase();
    const user = users.find(u => u.email === lowerEmail);

    if (!user || !checkPassword(password, user.password)) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = `mock_token_for_${lowerEmail}`;
    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
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

    // Only expose public user data (id, name, email)
    const { id, name, email } = req.user;
    return res.status(200).json({ user: { id, name, email } });
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
    // For this mock, we just confirm session closure.
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
