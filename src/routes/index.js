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

// Placeholder for authentication middleware
const requireAuth = (req, res, next) => { if (!req.user) req.user = { id: 'user-1', email: 'mock@example.com' }; return next(); };

// Auth Routes (Laravel: Route::prefix('auth')->group(...))
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Authenticated Auth routes (protected by sanctum, via placeholder)
router.use('/auth', requireAuth);
router.get('/auth/me', AuthController.me);
router.post('/auth/logout', AuthController.logout);

// Routes protected by general authentication (Laravel: Route::middleware('auth:sanctum')->group(...))
router.use(requireAuth);

// Projects Routes (Laravel: Route::apiResource('projects', ProjectController::class))
router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get('/projects/:project', ProjectController.show);
router.put('/projects/:project', ProjectController.update);
router.delete('/projects/:project', ProjectController.destroy);

// Nested Tasks Routes (Laravel: Route::apiResource('projects.tasks', TaskController::class))
router.get('/projects/:project/tasks', TaskController.index);
router.post('/projects/:project/tasks', TaskController.store);
router.get('/projects/:project/tasks/:task', TaskController.show);
router.put('/projects/:project/tasks/:task', TaskController.update);
router.delete('/projects/:project/tasks/:task', TaskController.destroy);
router.post('/projects/:project/tasks/:task/status', TaskController.changeStatus);

export default router;
