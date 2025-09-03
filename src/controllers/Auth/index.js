const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;

// Mock password hashing and comparison
const hash = p => `${p}_hashed`;
const compare = (plain, stored) => hash(plain) === stored;

// Helper to check for authenticated user
const authenticate = (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: 'No autenticado' });
        return false;
    }
    return true;
};

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email y password son requeridos.' });
        }

        const lowerCaseEmail = email.toLowerCase();
        const existingUser = users.find(u => u.email === lowerCaseEmail);
        if (existingUser) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        const newUser = {
            id: MEM.seq.user++,
            name,
            email: lowerCaseEmail,
            password: hash(password), // Store hashed password
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        users.push(newUser);

        const token = `mock_token_for_${newUser.email}`;
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
            return res.status(400).json({ message: 'Email y password son requeridos.' });
        }

        const lowerCaseEmail = email.toLowerCase();
        const user = users.find(u => u.email === lowerCaseEmail);

        if (!user || !compare(password, user.password)) {
            return res.status(422).json({ message: 'Credenciales inválidas' });
        }

        const token = `mock_token_for_${user.email}`;
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
        if (!authenticate(req, res)) {
            return; // authenticate already sent response
        }
        // Assuming req.user is set by an auth middleware and contains { id, name, email }
        return res.status(200).json({
            user: { id: req.user.id, name: req.user.name, email: req.user.email }
        });
    } catch (e) {
        return next(e);
    }
}

export async function logout(req, res, next) {
    try {
        // In a real app, this would invalidate a token.
        // For this mock, we just confirm logout.
        return res.status(200).json({ message: 'Sesión cerrada' });
    } catch (e) {
        return next(e);
    }
}

// Export a default object grouping all controller functions.
export default {
    register,
    login,
    me,
    logout,
};

// Export the underlying shared memory array for testing/inspection.
export const __users = MEM.users;
