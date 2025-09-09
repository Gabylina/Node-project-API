const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;

const hash = p => `${p}_hashed`;
const hashCompare = (plain, hashed) => hash(plain) === hashed;

const generateToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = 'mtok.';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y password son requeridos.' });
    }

    const lowerCaseEmail = String(email).toLowerCase();

    const existingUser = users.find(u => u.email === lowerCaseEmail);
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const newUser = {
      id: MEM.seq.user++,
      name: String(name),
      email: lowerCaseEmail,
      password: hash(String(password)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = generateToken();
    MEM.sessions[token] = newUser.id;

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    return res.status(201).json({ user: userResponse, token });
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

    const lowerCaseEmail = String(email).toLowerCase();
    const user = users.find(u => u.email === lowerCaseEmail);

    if (!user || !hashCompare(String(password), user.password)) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken();
    MEM.sessions[token] = user.id;

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({ user: userResponse, token });
  } catch (e) {
    return next(e);
  }
}

export async function me(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const userResponse = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };

    return res.status(200).json({ user: userResponse });
  } catch (e) {
    return next(e);
  }
}

export async function logout(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // The middleware that set req.user already validated this token against MEM.sessions.
      // Therefore, if req.user exists, the token is valid and associated with req.user.id.
      delete MEM.sessions[token];
      return res.status(200).json({ message: 'Sesión cerrada' });
    }
    // This case should ideally not happen if an auth middleware successfully populated req.user.
    // However, as a fallback for a malformed request, we respond accordingly.
    return res.status(400).json({ message: 'Token de autorización no proporcionado en la cabecera.' });

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
