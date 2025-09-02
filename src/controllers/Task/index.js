import * as taskService from '../../services/taskService.js';
import * as projectService from '../../services/projectService.js';
// Assuming an authentication middleware populates req.user
// Assuming a custom error class like ApiError for consistent error handling.
// import ApiError from '../../utils/ApiError.js';

// Placeholder for TaskStatus enum, adapt as per your Node.js enum implementation
const TaskStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
});

/**
 * Helper function to authorize project ownership.
 * Throws an error if the user is not the owner.
 * @param {object} req - Express request object
 * @param {object} project - The project object
 * @throws {Error} If the user is not authorized.
 */
async function _authorizeOwner(req, project) {
  if (!req.user || req.user.id !== project.user_id) {
    // Or throw new ApiError(403, 'No autorizado.'); if using custom error classes
    throw new Error('No autorizado.');
  }
}

export async function index(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    await _authorizeOwner(req, project);

    const tasks = await taskService.listTasks(project);
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
}

export async function store(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    await _authorizeOwner(req, project);

    // req.body should contain the validated data, similar to Laravel's $request->validated()
    const task = await taskService.createTask(project, req.body);
    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
}

export async function show(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    await _authorizeOwner(req, project);

    const task = await taskService.getTaskByIdAndProject(taskId, projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    await _authorizeOwner(req, project);

    let task = await taskService.getTaskByIdAndProject(taskId, projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    // req.body should contain the validated data, similar to Laravel's $request->validated()
    task = await taskService.updateTask(task, req.body);
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    await _authorizeOwner(req, project);

    const task = await taskService.getTaskByIdAndProject(taskId, projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    await taskService.deleteTask(task);
    return res.status(204).json({}); // Laravel's response()->json([], 204) often means no content but explicit JSON.
  } catch (err) {
    return next(err);
  }
}

export async function changeStatus(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    // In Express, validation like this should typically be a middleware.
    // For this example, we'll quickly check, but recommend a dedicated validator.
    const { status } = req.body;

    // Get allowed status values from the TaskStatus enum
    const allowedStatuses = Object.values(TaskStatus);
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `El estado es requerido y debe ser uno de: ${allowedStatuses.join(', ')}.` });
    }

    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    await _authorizeOwner(req, project);

    let task = await taskService.getTaskByIdAndProject(taskId, projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    task = await taskService.updateTask(task, { status });
    return res.status(200).json(task);
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
