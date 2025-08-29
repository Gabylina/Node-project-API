import ProjectService from '../../services/ProjectService.js'; // TODO: Adjust path to your ProjectService
import ProjectModel from '../../models/Project.js';         // TODO: Adjust path to your Mongoose/Sequelize Project model
import { Project } from '../../models/index.js';

// A basic HttpError class to carry status codes and messages through Express's error handling middleware.
// Ideally, this would be defined in a shared utility file (e.g., `src/utils/HttpError.js`) and imported.
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

export async function index(req, res, next) {
  try {
    // TODO: Implement authentication middleware to populate req.user
    // req.user should contain the authenticated user object, similar to Laravel's $request->user()
    const projects = await ProjectService.listFor(req.user);
    return res.status(200).json(projects);
  } catch (err) {
    return next(err);
  }
}

export async function store(req, res, next) {
  try {
    // TODO: Implement validation middleware (e.g., 'express-validator' or Joi)
    // The validated data (from StoreProjectRequest) is assumed to be in req.body after validation.
    const project = await ProjectService.createFor(req.user, req.body);
    return res.status(201).json(project);
  } catch (err) {
    return next(err);
  }
}

export async function show(req, res, next) {
  try {
    const projectId = req.params.id; // Mapped from Laravel's route parameter {id}
    // TODO: Replace with your actual ORM/ODM call (e.g., Mongoose, Sequelize)
    // Example uses Mongoose-like syntax ProjectModel.findById(id).populate('tasks')
    const project = await ProjectModel.findById(projectId).populate('tasks');

    if (!project) {
      // Equivalent to Laravel's findOrFail throwing a 404
      throw new HttpError(404, 'Project not found.');
    }

    // Laravel's private authorizeOwner method logic integrated here
    // TODO: req.user.id needs to be securely populated by an authentication middleware
    // We assume project.user_id is convertible to string for comparison (e.g., Mongoose ObjectId)
    if (req.user?.id !== project.user_id.toString()) {
      // Equivalent to Laravel's abort(403, 'No autorizado.')
      throw new HttpError(403, 'No autorizado.');
    }

    return res.status(200).json(project);
  } catch (err) {
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const projectId = req.params.id; // Mapped from Laravel's route parameter {id}
    // TODO: Replace with your actual ORM/ODM call
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw new HttpError(404, 'Project not found.');
    }

    // Laravel's private authorizeOwner method logic integrated here
    if (req.user?.id !== project.user_id.toString()) {
      throw new HttpError(403, 'No autorizado.');
    }

    // TODO: Validation middleware should ensure req.body has validated data (from UpdateProjectRequest)
    const updatedProject = await ProjectService.update(project, req.body);
    return res.status(200).json(updatedProject);
  } catch (err) {
    return next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    const projectId = req.params.id; // Mapped from Laravel's route parameter {id}
    // TODO: Replace with your actual ORM/ODM call
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw new HttpError(404, 'Project not found.');
    }

    // Laravel's private authorizeOwner method logic integrated here
    if (req.user?.id !== project.user_id.toString()) {
      throw new HttpError(403, 'No autorizado.');
    }

    // TODO: Replace with your actual ORM/ODM delete method (e.g., Mongoose's deleteOne)
    await project.deleteOne();
    return res.status(204).json(); // 204 No Content typically sends an empty body
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
};
