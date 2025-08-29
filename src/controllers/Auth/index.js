/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body; // TODO: Validate with express-validator

    // TODO: Use a service for user creation & token generation
    const user = await User.create({
      name: name,
      email: email.toLowerCase(),
      password: await Hash.make(password),
    });

    const token = user.createToken('api').plainTextToken;
    return res.status(201).json({ user: user, token: token });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body; // TODO: Validate with express-validator

    // TODO: Use a service for authentication and token generation
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !(await Hash.check(password, user.password))) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = user.createToken('api').plainTextToken;
    return res.status(200).json({ user: user, token: token });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function me(req, res, next) {
  try {
    // TODO: Fetch user data based on req.user.id, potentially using a service
    return res.status(200).json(req.user);
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function logout(req, res, next) {
  try {
    // TODO: Invalidate the token (implementation depends on how tokens are stored)
    // Example, assuming tokens are stored with a reference to the user:
    if (!req.user?.id) return res.sendStatus(401)

    // const deleted = await req.user.currentAccessToken().delete(); // OLD
    // if(!deleted) return res.sendStatus(500);
    // TODO: Implement token revoking / invalidation using appropriate ORM/ODM logic

    return res.status(200).json({ message: 'Sesión cerrada' });
  } catch (err) {
    return next(err);
  }
}

import User from '../../models/User.js'; // TODO: Ajusta la ruta al modelo User
import Hash from '../../utils/hash.js'; // TODO: Ajusta la ruta a una utilidad de hash (bcrypt)

export default {
  register,
  login,
  me,
  logout,
};
