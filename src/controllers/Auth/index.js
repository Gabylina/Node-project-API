const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;

const hash = p => `${p}_hashed`;
const checkHash = (plain, stored) => hash(plain) === stored;

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nombre, email y password son requeridos.' });
        }

        const lowerEmail = String(email).toLowerCase();

        if (users.some(u => u.email === lowerEmail)) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        const newUser = {
            id: MEM.seq.user++,
            name: name,
            email: lowerEmail,
            password: hash(password),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        users.push(newUser);

        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };

        const token = `mock_token_for_${lowerEmail}`;
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

        const lowerEmail = String(email).toLowerCase();
        const user = users.find(u => u.email === lowerEmail);

        if (!user || !checkHash(password, user.password)) {
            return res.status(422).json({ message: 'Credenciales inválidas' });
        }

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        const token = `mock_token_for_${lowerEmail}`;
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
        const { id, name, email } = req.user;
        return res.status(200).json({ user: { id, name, email } });
    } catch (e) {
        return next(e);
    }
}

export async function logout(req, res, next) {
    try {
        if (!req.user) {
             return res.status(401).json({ message: 'No autenticado para cerrar sesión' });
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
