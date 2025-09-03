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

// Placeholder for authentication middleware (reemplazar por una implementación real de JWT, OAuth, etc.)
const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const token = auth.substring(7);
    // Los tokens en AuthController son del tipo "mock_token_for_<email>"
    const email = token.replace('mock_token_for_', '');
    // Busca el usuario en el "DB" en memoria (AuthController.users)
    import('../controllers/Auth/index.js').then(m => {
      const Auth = m.default ?? m;
      const users = Auth.__users || [];
      const user = users.find(u => u.email === email);
      if (!user) return res.status(401).json({ message: 'Token inválido' });
      req.user = user;
      next();
    });
  } catch (e) {
    return res.status(401).json({ message: 'No autenticado' });
  }
};

// Auth routes (correspondiente a Route::prefix('auth')->group(...))
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Aplica el middleware de autenticación a las rutas protegidas bajo '/auth'
router.use('/auth', requireAuth);
router.get('/auth/me', AuthController.me);
router.post('/auth/logout', AuthController.logout);

// Aplica el middleware de autenticación para todas las rutas definidas a partir de aquí
// (correspondiente a Route::middleware('auth:sanctum')->group(...))
router.use(requireAuth);

// Projects (equivalente a Route::apiResource('projects', ProjectController::class))
router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get('/projects/:project', ProjectController.show);
router.put('/projects/:project', ProjectController.update);
router.delete('/projects/:project', ProjectController.destroy);

// Nested Tasks (equivalente a Route::apiResource('projects.tasks', TaskController::class) y otras rutas)
router.get('/projects/:project/tasks', TaskController.index);
router.post('/projects/:project/tasks', TaskController.store);
router.get('/projects/:project/tasks/:task', TaskController.show);
router.put('/projects/:project/tasks/:task', TaskController.update);
router.delete('/projects/:project/tasks/:task', TaskController.destroy);
router.post('/projects/:project/tasks/:task/status', TaskController.changeStatus);

export default router;