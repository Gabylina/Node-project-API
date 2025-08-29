
// === n8n patch: dynamic AppError with fallback ===
let AppError;
try {
  const m = await import('../../utils/AppError.js');
  AppError = m.default ?? m.AppError ?? class extends Error { constructor(msg, code){ super(msg); this.statusCode = code; } };
} catch {
  AppError = class extends Error { constructor(msg, code){ super(msg); this.statusCode = code; } };
}
// === end n8n patch ===

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

// TODO: Import models and services
// import { Project, Task } from '../../models'
// import { TaskService } from '../../services'

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function index(req, res, next) {
  try {
    const projectId = req.params.project;
    // TODO: Fetch project, authorize owner and list tasks
    // const project = await Project.findOrFail(projectId);
    // authorizeOwner(req.user?.id, project.user_id);
    // const tasks = await TaskService.list(project);
    // return res.status(200).json(tasks);
    return res.status(200).json({ ok: true, message: 'index' });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */\export async function store(req, res, next) {
  try {
    const projectId = req.params.project;
    // TODO: Validate request, fetch project, authorize owner and create task
    // const project = await Project.findOrFail(projectId);
    // authorizeOwner(req.user?.id, project.user_id);
    // const task = await TaskService.create(project, req.body);
    // return res.status(201).json(task);
    return res.status(201).json({ ok: true, message: 'store' });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function show(req, res, next) {
  try {
    const projectId = req.params.project;
    const taskId = req.params.task;
    // TODO: Fetch project, authorize owner and find task
    // const project = await Project.findOrFail(projectId);
    // authorizeOwner(req.user?.id, project.user_id);
    // const task = await Task.where('project_id', projectId).findOrFail(taskId);
    // return res.status(200).json(task);
    return res.status(200).json({ ok: true, message: 'show' });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function update(req, res, next) {
  try {
    const projectId = req.params.project;
    const taskId = req.params.task;
    // TODO: Fetch project, authorize owner and update task
    // const project = await Project.findOrFail(projectId);
    // authorizeOwner(req.user?.id, project.user_id);
    // const task = await Task.where('project_id', projectId).findOrFail(taskId);
    // const updatedTask = await TaskService.update(task, req.body);
    // return res.status(200).json(updatedTask);
    return res.status(200).json({ ok: true, message: 'update' });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function destroy(req, res, next) {
  try {
    const projectId = req.params.project;
    const taskId = req.params.task;
    // TODO: Fetch project, authorize owner and delete task
    // const project = await Project.findOrFail(projectId);
    // authorizeOwner(req.user?.id, project.user_id);
    // const task = await Task.where('project_id', projectId).findOrFail(taskId);
    // await task.delete();
    // return res.status(204).json();
    return res.status(204).json({ok: true, message: 'destroy'});
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function changeStatus(req, res, next) {
  try {
    const projectId = req.params.project;
    const taskId = req.params.task;
    // TODO: Validate request, fetch project, authorize owner and change task status
    // const project = await Project.findOrFail(projectId);
    // authorizeOwner(req.user?.id, project.user_id);
    // const task = await Task.where('project_id', projectId).findOrFail(taskId);
    // const updatedTask = await TaskService.update(task, { status: req.body.status });
    // return res.status(200).json(updatedTask);
    return res.status(200).json({ ok: true, message: 'changeStatus' });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {string | number | undefined} userId
 * @param {string | number} projectUserId
 */
function authorizeOwner(userId, projectUserId) {
    // TODO: Implement authorizeOwner function
    // if (userId !== projectUserId) {
    //     res.sendStatus(403);
    // }
}

export default {
  index,
  store,
  show,
  update,
  destroy,
  changeStatus,
};
