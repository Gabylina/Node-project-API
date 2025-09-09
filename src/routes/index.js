/* migrated from routes/api.php */
import { Router } from 'express';
import * as AuthNS from '../controllers/Auth/index.js';
import * as ProjectNS from '../controllers/Project/index.js';
import * as TaskNS from '../controllers/Task/index.js';
const TaskController = TaskNS.default ?? TaskNS;
const ProjectController = ProjectNS.default ?? ProjectNS;
const AuthController = AuthNS.default ?? AuthNS;

const router = Router();
router.get('/ping', (_req, res) => res.status(200).json({ pong: true }));
const requireAuth = (req, res, next) => {
  try {
    // 1) Extraer token desde Authorization / x-access-token / ?token
    let auth = req.headers?.authorization || req.headers?.Authorization || '';
    let token = '';
    if (typeof auth === 'string' && auth.length) {
      token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    }
    if (!token && typeof req.headers['x-access-token'] === 'string') token = req.headers['x-access-token'];
    if (!token && typeof req.query?.token === 'string') token = req.query.token;

    if (!token) return res.status(401).json({ message: 'No autenticado' });
    if (!token.startsWith('mtok.')) return res.status(401).json({ message: 'Token inválido' });

    // 2) MEM con sesiones opacas (token -> userId)
    const MEM = (globalThis.__MEMDB ||= {
      users: [],
      projects: [],
      tasks: [],
      sessions: {}, // <-- mapa de sesiones
      seq: { user: 1, project: 1, task: 1 },
    });

    // 3) Resolver usuario por sesión
    const userId = MEM.sessions[token];
    if (!userId) return res.status(401).json({ message: 'Token inválido' });

    const user = MEM.users.find(u => u.id === userId);
    if (!user) return res.status(401).json({ message: 'Token inválido' });

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'No autenticado' });
  }
};

// Public Auth routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Authenticated Auth routes (protected by sanctum in Laravel)
router.use('/auth', requireAuth); // Apply middleware to all subsequent '/auth' routes
router.get('/auth/me', AuthController.me);
router.post('/auth/logout', AuthController.logout);

// Authenticated API routes (Projects and Tasks, protected by sanctum in Laravel)
router.use(requireAuth); // Apply middleware to all subsequent routes

// Projects (apiResource mapping)
router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get('/projects/:project', ProjectController.show);
router.put('/projects/:project', ProjectController.update);
router.delete('/projects/:project', ProjectController.destroy);

// Tasks (nested apiResource mapping)
router.get('/projects/:project/tasks', TaskController.index);
router.post('/projects/:project/tasks', TaskController.store);
router.get('/projects/:project/tasks/:task', TaskController.show);
router.put('/projects/:project/tasks/:task', TaskController.update);
router.delete('/projects/:project/tasks/:task', TaskController.destroy);
router.post('/projects/:project/tasks/:task/status', TaskController.changeStatus);

export default router;