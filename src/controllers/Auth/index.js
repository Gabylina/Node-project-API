/*
 * TODO: Import necessary modules for database interaction, password hashing, and token management.
 * Examples:
 * - User model: `import User from '../../models/User.js';` (if using an ORM/ODM like Mongoose, Sequelize, Prisma)
 * - Password hashing: `import bcrypt from 'bcryptjs';` or `import argon2 from 'argon2';`
 * - JWT generation: `import jwt from 'jsonwebtoken';`
 *
 * Note on Request Validation:
 * Laravel's `RegisterRequest` and `LoginRequest` are Form Request Objects that handle validation automatically.
 * In Express.js, request body validation must be implemented using middleware placed BEFORE these controller handlers.
 * Popular options include `express-validator`, Joi, or Zod schemas.
 */

export async function register(req, res, next) {
  try {
    // Mapeo Laravel: $request->name, $request->email, $request->password
    const { name, email, password } = req.body;

    // TODO: 1. Implement password hashing.
    // Example: const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: 2. Implement user creation in your database.
    // Example: const user = await User.create({
    //   name,
    //   email: email.toLowerCase(),
    //   password: hashedPassword,
    // });

    // TODO: 3. Implement token generation (e.g., JWT).
    // Example: const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // --- Placeholder/Mock Implementation (replace with actual service/model calls) ---
    const newUser = { id: 'mock-user-id', name, email: email.toLowerCase() };
    const token = 'mock-jwt-token-for-registration';
    // --------------------------------------------------------------------------

    return res.status(201).json({ user: newUser, token });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    // Mapeo Laravel: $request->email, $request->password
    const { email, password } = req.body;

    // TODO: 1. Implement finding the user by email in your database.
    // Example: const user = await User.findOne({ email: email.toLowerCase() });

    // TODO: 2. Implement password comparison.
    // Example: if (!user || !(await bcrypt.compare(password, user.password))) {
    //   return res.status(422).json({ message: 'Credenciales inválidas' });
    // }

    // --- Placeholder/Mock Implementation (replace with actual service/model calls) ---
    const userFound = { id: 'mock-user-id', name: 'Mock User', email: email.toLowerCase(), password: 'hashed_password_from_db' }; // Simulates user found
    if (!userFound || password !== 'testpassword') { // Simplified mock comparison
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }
    const token = 'mock-jwt-token-for-login';
    const userResponse = { id: userFound.id, name: userFound.name, email: userFound.email }; // Do not return hashed password
    // --------------------------------------------------------------------------

    return res.status(200).json({ user: userResponse, token });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    // Mapeo Laravel: $request->user()
    // En Express, `req.user` is typically populated by an authentication middleware (e.g., JWT middleware)
    // after successfully verifying a token provided in the request headers (e.g., Authorization: Bearer <token>).
    if (!req.user) {
      // This case should ideally be handled by an authentication middleware returning 401 earlier in the request lifecycle.
      return res.status(401).json({ message: 'No autenticado o token inválido.' });
    }

    return res.status(200).json(req.user);
  } catch (err) {
    return next(err);
  }
}

export async function logout(req, res, next) {
  try {
    // Mapeo Laravel: $request->user()->currentAccessToken()->delete();
    // En Express con JWTs sin estado, 'logout' usualmente significa que el cliente descarta el token.
    // Si se requiere invalidación del token en el lado del servidor (ej. para revocar tokens de larga duración),
    // se necesitaría un mecanismo como una lista negra de JWTs (almacenando tokens invalidados en una base de datos/caché).
    // TODO: Implementar cualquier lógica de invalidación de token en el lado del servidor si tu aplicación lo requiere.

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
