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

// Middleware placeholder for authentication (equivalent to 'auth:sanctum')
const requireAuth = (req,res,next) => { /* TODO: reemplazar por middleware real */ return next(); };

// Auth routes (equivalent to Route::prefix('auth')->group(...))
// Unauthenticated routes under /auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Apply authentication middleware specifically for subsequent '/auth' routes
// This mimics the sanctum middleware within the 'auth' prefix group.
router.use('/auth', requireAuth);
router.get('/auth/me', AuthController.me);
router.post('/auth/logout', AuthController.logout);

// Global authentication for routes that require 'auth:sanctum' middleware
// This applies the middleware to all routes defined *after* this line.
router.use(requireAuth);

// Projects routes (equivalent to Route::apiResource('projects', ProjectController))
router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get('/projects/:project', ProjectController.show);
router.put('/projects/:project', ProjectController.update);
router.delete('/projects/:project', ProjectController.destroy);

// Nested Tasks routes (equivalent to Route::apiResource('projects.tasks', TaskController))
router.get('/projects/:project/tasks', TaskController.index);
router.post('/projects/:project/tasks', TaskController.store);
router.get('/projects/:project/tasks/:task', TaskController.show);
router.put('/projects/:project/tasks/:task', TaskController.update);
router.delete('/projects/:project/tasks/:task', TaskController.destroy);
router.post('/projects/:project/tasks/:task/status', TaskController.changeStatus);

export default router;
