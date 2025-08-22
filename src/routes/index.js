/* migrated from routes/api.php */
import { Router } from 'express';
import * as AuthController from '../controllers/Auth/index.js';
import * as ProjectController from '../controllers/Project/index.js';
import * as TaskController from '../controllers/Task/index.js';

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// protegido por sanctum (placeholder)
const requireAuth = (req,res,next) => { /* TODO: reemplazar por middleware real */ return next(); };

router.use('/auth', requireAuth);
router.get('/auth/me', AuthController.me);
router.post('/auth/logout', AuthController.logout);

router.use(requireAuth);

router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get('/projects/:project', ProjectController.show);
router.put('/projects/:project', ProjectController.update);
router.delete('/projects/:project', ProjectController.destroy);

router.get('/projects/:project/tasks', TaskController.index);
router.post('/projects/:project/tasks', TaskController.store);
router.get('/projects/:project/tasks/:task', TaskController.show);
router.put('/projects/:project/tasks/:task', TaskController.update);
router.delete('/projects/:project/tasks/:task', TaskController.destroy);
router.post('/projects/:project/tasks/:task/status', TaskController.changeStatus);

export default router;