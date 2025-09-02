// Auth controller for Express.js

// A simple in-memory "database" for demonstration purposes.
// In a real application, this would interact with a proper database.
const users = [];

// Helper to simulate password hashing
const hashPassword = (password) => `${password}-hashed`;
const checkPassword = (plainPassword, hashedPassword) =>
  hashedPassword === `${plainPassword}-hashed`;

// Helper to simulate token creation
const createToken = (userEmail) => `mock_token_for_${userEmail}`;

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Simulate user creation and password hashing
    const newUser = {
      id: users.length + 1,
      name: name,
      email: String(email).toLowerCase(),
      password: hashPassword(password),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    users.push(newUser); // Add to mock DB

    // Simulate token generation
    const token = createToken(newUser.email);

    return res.status(201).json({ user: newUser, token });
  } catch (e) {
    return next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Simulate finding a user by email
    const user = users.find((u) => u.email === String(email).toLowerCase());

    if (!user || !checkPassword(password, user.password)) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    // Simulate token generation
    const token = createToken(user.email);

    return res.status(200).json({ user, token });
  } catch (e) {
    return next(e);
  }
}

export async function me(req, res, next) {
  try {
    // In a real application, req.user would be populated by an authentication middleware.
    // If req.user is not set by middleware, it means the user is not authenticated.
    // The original PHP returns user() which can be null, so we mimic that behavior.
    return res.status(200).json(req.user || null);
  } catch (e) {
    return next(e);
  }
}

export async function logout(req, res, next) {
  try {
    // In a real application, req.user would be populated by an authentication middleware.
    // If not, the user is not authenticated, mimicking the PHP behavior of trying to call on null.
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    // Simulate token invalidation/deletion. In a real scenario,
    // this would interact with a database or token store.

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
