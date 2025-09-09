const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;

// --- Helpers ---
const hash = p => `${p}_hashed`;
const compare = (plain, hashed) => `${plain}_hashed` === hashed;

const randomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generateToken = () => "mtok." + randomString(32);

const extractToken = (req) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token && req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
    }
    if (!token && req.query?.token) {
        token = req.query.token;
    }
    return token;
};

// --- Controller Functions ---

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nombre, correo electrónico y contraseña son obligatorios.' });
        }

        const lowerEmail = email.toLowerCase();
        const existingUser = users.find(u => u.email === lowerEmail);
        if (existingUser) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const now = new Date().toISOString();
        const newUser = {
            id: MEM.seq.user++,
            name,
            email: lowerEmail,
            password: hash(password),
            createdAt: now,
            updatedAt: now,
        };

        users.push(newUser);

        const token = generateToken();
        MEM.sessions[token] = newUser.id;

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
            return res.status(400).json({ message: 'Correo electrónico y contraseña son obligatorios.' });
        }

        const lowerEmail = email.toLowerCase();
        const user = users.find(u => u.email === lowerEmail);

        if (!user || !compare(password, user.password)) {
            return res.status(422).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken();
        MEM.sessions[token] = user.id;

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
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const user = users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (e) {
        return next(e);
    }
}

export async function logout(req, res, next) {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(400).json({ message: 'Token de autorización no proporcionado.' });
        }

        if (MEM.sessions[token]) {
            delete MEM.sessions[token];
            return res.status(200).json({ message: 'Sesión cerrada' });
        } else {
            return res.status(400).json({ message: 'Token de autorización inválido.' });
        }
    } catch (e) {
        return next(e);
    }
}

// --- Exports ---
export const __users = MEM.users;

const AuthController = {
    register,
    login,
    me,
    logout,
};

export default AuthController;
