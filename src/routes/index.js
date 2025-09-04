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
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const token = auth.substring(7);
    const email = token.replace('mock_token_for_', '');

    // Misma forma que en controllers: seq
    const MEM = (globalThis.__MEMDB ||= {
      users: [],
      projects: [],
      tasks: [],
      seq: { user: 1, project: 1, task: 1 },
    });

    const user = MEM.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Token inválido' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'No autenticado' });
  }
};

// Non-protected authentication routes (from Route::prefix('auth')->group())
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Protected authentication routes (from Route::prefix('auth')->middleware('auth:sanctum')->group())
router.use('/auth', requireAuth); // Apply requireAuth to all routes starting with /auth from this point

router.get('/auth/me', AuthController.me);
router.post('/auth/logout', AuthController.logout);

// Routes protected by 'auth:sanctum' middleware (from Route::middleware('auth:sanctum')->group())
router.use(requireAuth);

// Projects (apiResource equivalent)
router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get('/projects/:project', ProjectController.show);
router.put('/projects/:project', ProjectController.update);
router.delete('/projects/:project', ProjectController.destroy);

// Tasks (nested resource equivalent)
router.get('/projects/:project/tasks', TaskController.index);
router.post('/projects/:project/tasks', TaskController.store);
router.get('/projects/:project/tasks/:task', TaskController.show);
router.put('/projects/:project/tasks/:task', TaskController.update);
router.delete('/projects/:project/tasks/:task', TaskController.destroy);
router.post('/projects/:project/tasks/:task/status', TaskController.changeStatus);

export default router;
