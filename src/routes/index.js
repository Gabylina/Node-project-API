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

// Auth routes (unprotected)
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Auth middleware placeholder (from Laravel Sanctum)
const requireAuth = (req, res, next) => {
  try {
    let auth = req.headers?.authorization || req.headers?.Authorization || '';
    let token = '';
    if (typeof auth === 'string' && auth.length) {
      token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    }
    if (!token && typeof req.headers['x-access-token'] === 'string') token = req.headers['x-access-token'];
    if (!token && typeof req.query?.token === 'string') token = req.query.token;

    if (!token) return res.status(401).json({ message: 'No autenticado' });

    const PREFIX = 'mock_token_for_';
    if (!token.startsWith(PREFIX)) return res.status(401).json({ message: 'Token inválido' });
    const email = token.substring(PREFIX.length);

    const MEM = (globalThis.__MEMDB ||= {
      users: [],
      projects: [],
      tasks: [],
      seq: { user: 1, project: 1, task: 1 },
    });

    const user = MEM.users.find(u => String(u.email || '').toLowerCase() === String(email || '').toLowerCase());
    if (!user) return res.status(401).json({ message: 'Token inválido' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'No autenticado' });
  }
};

// Apply auth middleware to /auth routes that require it
// This 'router.use' applies only to routes starting with '/auth'
router.use('/auth', requireAuth);
router.get('/auth/me', AuthController.me);
router.post('/auth/logout', AuthController.logout);

// Apply auth middleware to all subsequent routes (from Laravel 'auth:sanctum' middleware group)
// This 'router.use' will apply to all routes defined after it, effectively protecting projects and tasks.
router.use(requireAuth);

// Project routes (apiResource equivalent)
router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get('/projects/:project', ProjectController.show);
router.put('/projects/:project', ProjectController.update);
router.delete('/projects/:project', ProjectController.destroy);

// Nested Task routes
router.get('/projects/:project/tasks', TaskController.index);
router.post('/projects/:project/tasks', TaskController.store);
router.get('/projects/:project/tasks/:task', TaskController.show);
router.put('/projects/:project/tasks/:task', TaskController.update);
router.delete('/projects/:project/tasks/:task', TaskController.destroy);
router.post('/projects/:project/tasks/:task/status', TaskController.changeStatus);

export default router;
