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

// Placeholder para el middleware de autenticación (equivalente a 'auth:sanctum')
const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const token = auth.substring(7);
    const email = token.replace('mock_token_for_', '');

    // Lee directamente de la MEMDB compartida
    const DB = (globalThis.__MEMDB ||= {
      users: [],
      projects: [],
      tasks: [],
      counters: { userId: 1, projectId: 1, taskId: 1 }
    });
    const user = DB.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Token inválido' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'No autenticado' });
  }
};

// Rutas de autenticación (equivalente a Route::prefix('auth')->group(...))
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Rutas de autenticación protegidas por 'sanctum' (aplicamos el placeholder 'requireAuth' al prefijo /auth)
router.use('/auth', requireAuth); // Aplica el middleware a las rutas /auth subsiguientes
router.get('/auth/me', AuthController.me);
router.post('/auth/logout', AuthController.logout);

// Rutas protegidas por el middleware 'auth:sanctum' (equivalente a Route::middleware('auth:sanctum')->group(...))
router.use(requireAuth); // Aplica el middleware a todas las rutas que se definan después de este punto

// Rutas de Proyectos (equivalente a apiResource)
router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get('/projects/:project', ProjectController.show);
router.put('/projects/:project', ProjectController.update);
router.delete('/projects/:project', ProjectController.destroy);

// Rutas de Tareas anidadas (equivalente a apiResource anidado)
router.get('/projects/:project/tasks', TaskController.index);
router.post('/projects/:project/tasks', TaskController.store);
router.get('/projects/:project/tasks/:task', TaskController.show);
router.put('/projects/:project/tasks/:task', TaskController.update);
router.delete('/projects/:project/tasks/:task', TaskController.destroy);
router.post('/projects/:project/tasks/:task/status', TaskController.changeStatus);

export default router;
