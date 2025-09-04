const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;

// Simple hashing mock
const hash = p => `${p}_hashed`;

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
    }

    const lowerCaseEmail = email.toLowerCase();

    if (users.some(u => u.email === lowerCaseEmail)) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const newUser = {
      id: MEM.seq.user++,
      name,
      email: lowerCaseEmail,
      password: hash(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = `mock_token_for_${lowerCaseEmail}`;
    return res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
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

    const lowerCaseEmail = email.toLowerCase();
    const user = users.find(u => u.email === lowerCaseEmail);

    if (!user || hash(password) !== user.password) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = `mock_token_for_${lowerCaseEmail}`;
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
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
    return res.status(200).json({ message: 'Sesión cerrada' });
  } catch (e) {
    return next(e);
  }
}

const AuthController = {
  register,
  login,
  me,
  logout,
};

export default AuthController;

export const __users = MEM.users;
