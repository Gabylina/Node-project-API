import { User } from '../../models/index.js';
import bcrypt from 'bcrypt'; // Asegúrate de tener bcrypt instalado: npm install bcrypt

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 saltos
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const token = user.createToken('api').plainTextToken; // Requiere implementación de createToken en el modelo User
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }
    const token = user.createToken('api').plainTextToken; // Requiere implementación de createToken en el modelo User
    return res.json({ user, token });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    return res.json(req.user);
  } catch (err) {
    return next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await req.user.currentAccessToken.revoke(); // Requiere implementación de currentAccessToken y revoke en el modelo User
    return res.json({ message: 'Sesión cerrada' });
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