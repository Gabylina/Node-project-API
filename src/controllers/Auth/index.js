
// === n8n patch: dynamic User/Hash/JWT with fallbacks ===
let User;
try { const m = await import('../../models/User.js'); User = m.default ?? m; }
catch {
  User = {
    async create(data){ return { id: 'mock-user', ...data, createToken(){ return { plainTextToken: 'mock-token' }; } }; },
    async findOne(){ return null; },
  };
}

let Hash;
try { const m = await import('../../utils/hash.js'); Hash = m.default ?? m; }
catch {
  let bcryptjs; try { const b = await import('bcryptjs'); bcryptjs = b.default ?? b; } catch {}
  Hash = {
    async make(plain){ return bcryptjs ? bcryptjs.hash(plain, 10) : String(plain); },
    async check(plain, hashed){ return bcryptjs ? bcryptjs.compare(plain, hashed) : String(plain) === String(hashed); },
  };
}

let JWT;
try { const m = await import('jsonwebtoken'); JWT = m.default ?? m; }
catch { JWT = { sign: () => 'mock-jwt-token' }; }
// === end n8n patch ===

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // TODO: Laravel's RegisterRequest handled validation. Implement request validation here (e.g., using Joi, Yup, express-validator).

    // TODO: Call a User service/model to create the user in the database.
    // Example: const hashedPassword = await Hash.make(password, 10);
    // Example: const user = await UserService.createUser({ name, email: email.toLowerCase(), password: hashedPassword });
    // Placeholder for user creation and hashing:
    const user = { id: 'new-user-id', name, email: email.toLowerCase(), createdAt: new Date() };

    // TODO: Generate an authentication token (e.g., JWT).
    // Example: const token = JWT.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Placeholder for token generation:
    const token = 'generated-jwt-token-for-user-' + user.id;

    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // TODO: Laravel's LoginRequest handled validation. Implement request validation here.

    // TODO: Call a User service/model to find the user by email.
    // Example: const user = await UserService.findUserByEmail(email.toLowerCase());
    // Placeholder for finding user:
    const user = { id: 'existing-user-id', name: 'Existing User', email: email.toLowerCase(), password: 'hashed_password_from_db' }; // Mock user with hashed password

    // TODO: Check if user exists and if the provided password matches the stored hashed password.
    // Example: if (!user || !(await Hash.check(password, user.password))) { return res.status(422).json({ message: 'Credenciales inválidas' }); }
    // Placeholder for password check:
    if (!user || password !== 'mockPassword123') { // Simplified mock check
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }
    // In a real app, exclude password from the user object sent back:
    user.password = undefined;

    // TODO: Generate an authentication token (e.g., JWT).
    // Example: const token = JWT.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Placeholder for token generation:
    const token = 'generated-jwt-token-for-user-' + user.id;

    return res.status(200).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    // req.user is expected to be populated by an authentication middleware (e.g., JWT strategy)
    // based on the token sent by the client.
    if (!req.user) {
      // This state implies authentication middleware failed or was not applied.
      return res.status(401).json({ message: 'No autenticado' });
    }
    return res.status(200).json(req.user);
  } catch (err) {
    return next(err);
  }
}

export async function logout(req, res, next) {
  try {
    // Laravel's Sanctum invalidates the token in the database.
    // For stateless JWTs, logout is often client-side (deleting the token from storage).
    // If you need server-side invalidation for JWTs, consider a token blacklist.
    // If using stateful tokens (like Sanctum's Personal Access Tokens),
    // you would call a service to delete/invalidate the token associated with req.user.
    // Example: if (req.user && req.user.tokenId) { await TokenService.deleteToken(req.user.tokenId); }

    return res.status(200).json({ message: 'Sesión cerrada' });
  } catch (err) {
    return next(err);
  }
}

export default {
  register,
  login,
  me,
  logout,
};
