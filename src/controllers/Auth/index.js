// src/controllers/Auth/index.js

const users = [];
let nextUserId = 1;

// Simulate simple password hashing for in-memory operations
const hashPassword = (password) => `hashed_${password}`;
const checkPassword = (plainPassword, hashedPassword) =>
  hashedPassword === `hashed_${plainPassword}`;

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y password son requeridos.' });
    }

    if (users.some(u => u.email === email.toLowerCase())) {
      return res.status(409).json({ message: 'Este email ya está registrado.' });
    }

    const newUser = {
      id: nextUserId++,
      name,
      email: email.toLowerCase(),
      password: hashPassword(password),
      // In a real app, 'token' wouldn't be stored directly on the user object
    };
    users.push(newUser);

    const token = `${newUser.id}_${Date.now()}_mocktoken`;
    // In a real app, the token would be generated securely and returned.
    // We'll add a 'current_token' to the user mock for 'me' endpoint consistency.
    // Note: this is a simplified in-memory mock and not a secure practice.
    newUser.current_token = token;

    return res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email }, token });
  } catch (e) {
    return next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === (email?.toLowerCase() ?? ''));

    if (!user || !checkPassword(password, user.password)) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    const token = `${user.id}_${Date.now()}_mocktoken`;
    user.current_token = token; // Update current token for mock user

    return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    return next(e);
  }
}

export async function me(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    // Assume req.user is populated by a prior middleware from the token
    // For this mock, we'll return a sanitized user object (without password hash)
    const userPayload = users.find(u => u.id === req.user.id);
    if (!userPayload) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Should ideally not happen if req.user is valid
    }
    return res.status(200).json({ id: userPayload.id, name: userPayload.name, email: userPayload.email });
  } catch (e) {
    return next(e);
  }
}

export async function logout(req, res, next) {
  try {
    // In a real app, this would invalidate the token (e.g., remove from a blacklist, delete from DB)
    // For this mock, we just respond with success.
    if (req.user) {
      const userIndex = users.findIndex(u => u.id === req.user.id);
      if (userIndex !== -1) {
        delete users[userIndex].current_token;
      }
    }
    return res.status(200).json({ message: 'Sesión cerrada' });
  } catch (e) {
    return next(e);
  }
}

export const __users = users;

export default {
  register,
  login,
  me,
  logout,
};
