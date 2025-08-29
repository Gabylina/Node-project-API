import TaskService from '../../services/taskService.js';
import Project from '../../models/Project.js'; // Assuming Sequelize/Mongoose Model
import Task from '../../models/Task.js';     // Assuming Sequelize/Mongoose Model
import { TaskStatus } from '../../enums/TaskStatus.js'; // Assuming a JS enum/object for TaskStatus

// === n8n patch: dynamic AppError with fallback ===
let AppError;
try {
  const m = await import('../../utils/AppError.js');
  AppError = m.default ?? m.AppError ?? class extends Error { constructor(msg, code){ super(msg); this.statusCode = code; } };
} catch {
  AppError = class extends Error { constructor(msg, code){ super(msg); this.statusCode = code; } };
}
// === end n8n patch ===


// TODO: Replace with actual dependency injection or instantiation strategy
const taskService = new TaskService();

// TODO: This class could be imported from a central error utility
class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Helper function to find a model instance or throw a 404 error.
 * @param {object} Model - The Sequelize/Mongoose model.
 * @param {object} query - The query object for findOne/findByPk.
 * @param {string} entityName - The name of the entity for the error message.
 * @returns {Promise<object>}
 */
async function findOrThrow(Model, query, entityName = 'Resource') {
  const instance = await Model.findOne(query);
  if (!instance) {
    throw new ApiError(`${entityName} not found`, 404);
  }
  return instance;
}

/**
 * Converts `authorizeOwner(Project $project)` from Laravel.
 * Checks if the authenticated user is the owner of the project.
 * @param {object} req - Express request object (expects req.user.id to be set by auth middleware).
 * @param {object} project - The project instance.
 */
async function authorizeOwner(req, project) {
  // TODO: `req.user?.id` relies on an authentication middleware populating `req.user`
  if (req.user?.id !== project.user_id) {
    throw new ApiError('No autorizado.', 403);
  }
}

export async function index(req, res, next) {
  try {
    const { projectId } = req.params;
    const project = await findOrThrow(Project, { where: { id: projectId } }, 'Project');
    
    await authorizeOwner(req, project);

    const tasks = await taskService.list(project);
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
}

export async function store(req, res, next) {
  try {
    const { projectId } = req.params;
    const project = await findOrThrow(Project, { where: { id: projectId } }, 'Project');

    await authorizeOwner(req, project);

    // TODO: `req.body` replaces `$request->validated()`. 
    // Validation (e.g., using Joi/Yup middleware) should be applied before this handler.
    const task = await taskService.create(project, req.body);
    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
}

export async function show(req, res, next) {
  try {
    const { projectId, taskId } = req.params;
    const project = await findOrThrow(Project, { where: { id: projectId } }, 'Project');

    await authorizeOwner(req, project);

    const task = await findOrThrow(Task, { where: { id: taskId, project_id: projectId } }, 'Task');
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { projectId, taskId } = req.params;
    const project = await findOrThrow(Project, { where: { id: projectId } }, 'Project');

    await authorizeOwner(req, project);

    const task = await findOrThrow(Task, { where: { id: taskId, project_id: projectId } }, 'Task');

    // TODO: `req.body` replaces `$request->validated()`. 
    // Validation (e.g., using Joi/Yup middleware) should be applied before this handler.
    const updated = await taskService.update(task, req.body);
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    const { projectId, taskId } = req.params;
    const project = await findOrThrow(Project, { where: { id: projectId } }, 'Project');

    await authorizeOwner(req, project);

    const task = await findOrThrow(Task, { where: { id: taskId, project_id: projectId } }, 'Task');
    await task.destroy(); // Assuming `destroy()` method for Sequelize/Mongoose models
    return res.status(204).json({});
  } catch (err) {
    return next(err);
  }
}

export async function changeStatus(req, res, next) {
  try {
    const { projectId, taskId } = req.params;

    // Manual validation equivalent to Laravel's `$request->validate()`
    const { status } = req.body;
    if (!status) {
      throw new ApiError('Status is required', 400);
    }
    if (!Object.values(TaskStatus).includes(status)) {
      throw new ApiError(`Invalid status. Must be one of: ${Object.values(TaskStatus).join(', ')}`, 400);
    }

    const project = await findOrThrow(Project, { where: { id: projectId } }, 'Project');

    await authorizeOwner(req, project);

    const task = await findOrThrow(Task, { where: { id: taskId, project_id: projectId } }, 'Task');

    const updated = await taskService.update(task, { status: status });
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
}

export default {
  index,
  store,
  show,
  update,
  destroy,
  changeStatus,
};
