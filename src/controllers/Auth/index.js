const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;

// Mock hashing functions (no real hashing for this exercise)
const hash = p => `${p}_hashed`;
const checkHash = (plain, hashed) => hash(plain) === hashed;

/**
 * Register a new user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
    }

    const lowerCaseEmail = String(email).toLowerCase();

    if (users.some(u => u.email === lowerCaseEmail)) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const newUser = {
      id: MEM.seq.user++,
      name: name,
      email: lowerCaseEmail,
      password: hash(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);

    const token = `mock_token_for_${lowerCaseEmail}`;

    const { password: _, ...userWithoutPass } = newUser;
    return res.status(201).json({ user: userWithoutPass, token });
  } catch (e) {
    return next(e);
  }
}

/**
 * Log in a user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    const lowerCaseEmail = String(email).toLowerCase();
    const user = users.find(u => u.email === lowerCaseEmail);

    if (!user || !checkHash(password, user.password)) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = `mock_token_for_${lowerCaseEmail}`;

    const { password: _, ...userWithoutPass } = user;
    return res.status(200).json({ user: userWithoutPass, token });
  } catch (e) {
    return next(e);
  }
}

/**
 * Get authenticated user details.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function me(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const { id, name, email } = req.user;
    return res.status(200).json({ user: { id, name, email } });
  } catch (e) {
    return next(e);
  }
}

/**
 * Log out the authenticated user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function logout(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    return res.status(200).json({ message: 'Sesión cerrada' });
  } catch (e) {
    return next(e);
  }
}

export const __users = MEM.users;

export default {
  register,
  login,
  me,
  logout,
};
