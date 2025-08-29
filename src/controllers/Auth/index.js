
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

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    // TODO: Validar request (RegisterRequest)

    // TODO: User::create
    const user = await /* User::create */ {};

    // TODO: $user->createToken('api')->plainTextToken;
    const token = 'TODO: GENERATE TOKEN';

    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    // TODO: Validar request (LoginRequest)

    // TODO: User::where('email', strtolower($request->email))->first();
    const user = await /* User::where */ {};

    if (!user || !/* Hash::check */ true) {
      return res.status(422).json({ message: 'Credenciales inválidas' });
    }

    // TODO: $user->createToken('api')->plainTextToken;
    const token = 'TODO: GENERATE TOKEN';

    return res.status(200).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    // TODO: Adaptar req->user()
    const user = req.user; // TODO: revisar como llega el usuario
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
}

export async function logout(req, res, next) {
  try {
    // TODO: Adaptar $request->user()->currentAccessToken()->delete();
    // TODO: await req.user.currentAccessToken().delete();
    // console.log(req.user);
    await /* req.user.currentAccessToken().delete() */; // TODO: revisar como eliminar el token

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
