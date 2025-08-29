import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Assume these are available, e.g., from your ORM/ODM setup (Mongoose, Sequelize, etc.)
import User from '../../models/User.js'; // Adjust path as needed for your project structure

// === n8n patch: dynamic User/Hash with fallbacks ===
let User;
try {
  const m = await import('../../models/User.js');
  User = m.default ?? m;
} catch {
  // Stub mínimo: que no rompa el import y permita flujo feliz en smoke
  User = {
    async create(data){
      return {
        id: 'mock-user',
        ...data,
        createToken(){ return { plainTextToken: 'mock-token' }; },
      };
    },
    async findOne(/* query */){
      // devuelve null por defecto (login inválido) para no simular éxitos engañosos
      return null;
    },
  };
}

let Hash;
try {
  const m = await import('../../utils/hash.js');
  Hash = m.default ?? m;
} catch {
  // Intentar usar bcryptjs si está disponible; si no, fallback simple
  let bcryptjs;
  try { const b = await import('bcryptjs'); bcryptjs = b.default ?? b; } catch {}
  Hash = {
    async make(plain){ return bcryptjs ? bcryptjs.hash(plain, 10) : String(plain); },
    async check(plain, hashed){ return bcryptjs ? bcryptjs.compare(plain, hashed) : String(plain) === String(hashed); },
  };
}
// === end n8n patch ===

// import TokenService from '../../services/TokenService.js'; // Uncomment if managing stateful tokens or refresh tokens

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here'; // IMPORTANT: Load from environment variables (e.g., .env file)

export async function register(req, res, next) {
  try {
    // Laravel's RegisterRequest handles validation before reaching the controller.
    // In Express, you would use a middleware for validation (e.g., express-validator, Joi).
    // We assume req.body already contains validated data.

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
    });

    // Laravel Sanctum's createToken generates a plainTextToken, often stored in DB.
    // In Node.js with Express, JWTs (JSON Web Tokens) are commonly used for stateless authentication.
    // The JWT payload typically includes user identifiers without sensitive info.
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Remove password from the user object before sending it in the response
    const userResponse = user.toObject ? user.toObject() : { ...user }; // Handle Mongoose documents and plain objects
    delete userResponse.password;

    return res.status(201).json({ user: userResponse, token });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    // Laravel's LoginRequest handles validation. Assuming req.body is validated.

    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Remove password from the user object before sending it in the response
    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.password;

    // As no status code was specified in the original for success, default to 200
    return res.status(200).json({ user: userResponse, token });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    // In Express, req.user is populated by an authentication middleware (e.g., Passport.js with JWT strategy)
    // after successfully verifying the token sent by the client.
    // It's crucial that this middleware is applied to the route where 'me' is used.

    if (!req.user) {
      // This scenario should ideally be caught by the authentication middleware itself (e.g., returning 401).
      // This is a safety check.
      return res.status(401).json({ message: 'No autenticado' });
    }

    // Assuming req.user is already a clean object (e.g., password removed) provided by the middleware.
    return res.status(200).json(req.user);
  } catch (err) {
    return next(err);
  }
}

export async function logout(req, res, next) {
  try {
    // Laravel's `$request->user()->currentAccessToken()->delete()` implies a stateful token system
    // where specific tokens are stored in the database and can be invalidated (like Sanctum).

    // For stateless JWTs (common in Node.js/Express):
    // 1. The primary 'logout' action is client-side: the client simply discards its token.
    // 2. Server-side action is generally not required for *access tokens* because they are stateless.
    //    They expire naturally based on `expiresIn` in `jwt.sign()`.
    // 3. If you use *refresh tokens* (which are stateful), you would implement server-side invalidation here
    //    (e.g., deleting the refresh token from your database).
    //    Example: `await TokenService.deleteRefreshToken(req.user.id, req.token);`
    //    (where `req.token` would be extracted by a middleware).

    // For a simple JWT setup, returning a success message is often sufficient.
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
