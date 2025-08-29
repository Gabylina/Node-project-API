import * as ProjectService from '../../services/ProjectService.js';
import Project from '../../models/Project.js'; // Assuming an ORM model

/**
 * Custom Error class to handle HTTP errors consistently.
 * This allows centralized error handling via Express middleware.
 */
class HttpError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

/**
 * Helper function to authorize project ownership.
 * Throws an HttpError if authorization fails.
 * @param {object | undefined} user - The authenticated user object from req.user.
 * @param {object} project - The project object.
 * @throws {HttpError} If the user is not authorized.
 */
const authorizeOwner = (user, project) => {
  if (!user || user.id !== project.user_id) {
    throw new HttpError('No autorizado.', 403);
  }
};

/**
 * Handles fetching a list of projects.
 * Corresponds to `ProjectController::index`.
 */
export async function index(req, res, next) {
  try {
    // TODO: Replace with actual service call
    // const projects = await ProjectService.listFor(req.user);
    // return res.status(200).json(projects);
    return res.status(200).json({ ok: true, message: 'index method called' });
  } catch (err) {
    return next(err);
  }
}

/**
 * Handles storing a new project.
 * Corresponds to `ProjectController::store`.
 */
export async function store(req, res, next) {
  try {
    // TODO: Implement validation middleware (e.g., Joi, Yup, express-validator) before this handler.
    // req.body would contain the validated data.
    // const project = await ProjectService.createFor(req.user, req.body);
    // return res.status(201).json(project);
    return res.status(201).json({ ok: true, message: 'store method called' });
  } catch (err) {
    return next(err);
  }
}

/**
 * Handles showing a single project.
 * Corresponds to `ProjectController::show`.
 */
export async function show(req, res, next) {
  try {
    const { id } = req.params; // {id} / route('x') → req.params.x

    // TODO: Fetch project from database, e.g.:
    // const project = await Project.findByPk(id, { include: ['tasks'] });
    // if (!project) {
    //   throw new HttpError('Project not found', 404);
    // }

    // Authorization
    // authorizeOwner(req.user, project); // auth()->id() / $request->user()?->id → req.user?.id

    // return res.status(200).json(project); // response()->json(data) → res.status(200).json(data)
    return res.status(200).json({ ok: true, message: `show method called for id ${id}` });
  } catch (err) {
    return next(err);
  }
}

/**
 * Handles updating an existing project.
 * Corresponds to `ProjectController::update`.
 */
export async function update(req, res, next) {
  try {
    const { id } = req.params;

    // TODO: Fetch project from database, e.g.:
    // const project = await Project.findByPk(id);
    // if (!project) {
    //   throw new HttpError('Project not found', 404);
    // }

    // Authorization
    // authorizeOwner(req.user, project);

    // TODO: Implement validation middleware and service call:
    // const updatedProject = await ProjectService.update(project, req.body); // $request->validated() → req.body
    // return res.status(200).json(updatedProject);
    return res.status(200).json({ ok: true, message: `update method called for id ${id}` });
  } catch (err) {
    return next(err);
  }
}

/**
 * Handles deleting a project.
 * Corresponds to `ProjectController::destroy`.
 */
export async function destroy(req, res, next) {
  try {
    const { id } = req.params;

    // TODO: Fetch project from database, e.g.:
    // const project = await Project.findByPk(id);
    // if (!project) {
    //   throw new HttpError('Project not found', 404);
    // }

    // Authorization
    // authorizeOwner(req.user, project);

    // TODO: Delete project from database, e.g.:
    // await project.destroy();

    // return res.status(204).json([]); // response()->json([], 204)
    return res.status(204).json([]); // Explicitly sending empty array as per PHP's json([], 204)
  } catch (err) {
    return next(err);
  }
}

// Export all handlers as a default object
export default {
  index,
  store,
  show,
  update,
  destroy,
};
