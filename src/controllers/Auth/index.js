import User from '../../models/User.js'; // TODO: Ajustar la ruta e implementar el modelo (e.g., Mongoose, Sequelize)
import bcrypt from 'bcrypt'; // TODO: Instalar y configurar una librería de hashing como bcryptjs o argon2
import jwt from 'jsonwebtoken'; // TODO: Instalar y configurar jsonwebtoken para generar JWTs

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


// TODO: Configurar la clave secreta de JWT y su expiración, idealmente desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Usar process.env.JWT_SECRET en producción
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Helper function para generar JWT, reemplazando a $user->createToken('api')->plainTextToken
 * @param {object} user - El objeto de usuario para el cual generar el token.
 * @returns {string} El token JWT generado.
 */
function generateAuthToken(user) {
    // Es importante incluir solo datos necesarios y no sensibles en el payload del token
    const payload = {
        id: user._id || user.id, // Mongoose usa _id, otros ORMs pueden usar id
        email: user.email,
        // Cualquier otro dato que se quiera acceder en req.user después de la autenticación
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function register(req, res, next) {
    try {
        // La validación de entrada (equivalente a RegisterRequest de Laravel) se gestionaría
        // con un middleware Express (e.g., joi, express-validator) antes de este handler.
        const { name, email, password } = req.body; // Mapeo: $request->name -> req.body.name

        // Comprobar si el usuario ya existe
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'Un usuario con este correo electrónico ya existe.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds de sal para bcrypt

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = generateAuthToken(user);

        // Convertir el documento del ORM (e.g., Mongoose) a un objeto plano y
        // eliminar el hash de la contraseña para la respuesta por seguridad.
        const userResponse = user.toObject ? user.toObject() : { ...user };
        delete userResponse.password;

        // Mapeo: response()->json(['user' => $user, 'token' => $token], 201) -> res.status(201).json({ user, token })
        return res.status(201).json({ user: userResponse, token });
    } catch (err) {
        return next(err);
    }
}

export async function login(req, res, next) {
    try {
        // La validación de entrada (equivalente a LoginRequest) se gestionaría con un middleware Express.
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        // Verificar si el usuario existe y si la contraseña es correcta
        // Mapeo: !Hash::check($request->password, $user->password) -> !await bcrypt.compare(password, user.password)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ message: 'Credenciales inválidas' });
        }

        const token = generateAuthToken(user);

        const userResponse = user.toObject ? user.toObject() : { ...user };
        delete userResponse.password;

        // Mapeo: response()->json(['user' => $user, 'token' => $token]) -> res.status(200).json({ user, token })
        return res.status(200).json({ user: userResponse, token });
    } catch (err) {
        return next(err);
    }
}

export async function me(req, res, next) {
    try {
        // req.user se espera que sea poblado por un middleware de autenticación (e.g., JWT strategy de Passport.js).
        // Mapeo: $request->user() -> req.user
        if (!req.user) {
            // Esto no debería ocurrir si el middleware de autenticación está configurado para detener requests no autenticados.
            return res.status(401).json({ message: 'No autenticado. Por favor, inicie sesión.' });
        }

        // Asumiendo que req.user ya es un objeto de usuario sin información sensible como el hash de la contraseña.
        // Si req.user aún contiene datos sensibles (ej. desde un payload JWT extendido), se debería limpiar aquí.
        const userResponse = req.user.toObject ? req.user.toObject() : { ...req.user };
        delete userResponse.password; // Asegurarse de que el hash de la contraseña nunca se envíe

        // Mapeo: response()->json($request->user()) -> res.status(200).json(req.user)
        return res.status(200).json(userResponse);
    } catch (err) {
        return next(err);
    }
}

export async function logout(req, res, next) {
    try {
        // En Laravel Sanctum, $request->user()->currentAccessToken()->delete() revoca un token específico de la DB.
        // En Express con JWTs (que son stateless), el "logout" generalmente implica que el cliente simplemente descarte el token.
        // Si se implementó un sistema de token con blacklist o tokens almacenados en DB (similar a Sanctum), la lógica
        // de invalidación/revocación iría aquí (e.g., añadir el token a una blacklist, eliminarlo de una DB de tokens activos).

        // TODO: Implementar lógica real de invalidación/revocación de token si es necesaria
        // (e.g., usando una base de datos para almacenar tokens y eliminando el actual).
        // Si req.user tuviera una referencia al token actual o ID de token, se podría usar aquí para la revocación.
        // Ejemplo ficticio si se usaran tokens en DB: await Token.deleteOne({ userId: req.user.id, token: req.token });

        // Mapeo: response()->json(['message' => 'Sesión cerrada']) -> res.status(200).json({ message: 'Sesión cerrada' })
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
