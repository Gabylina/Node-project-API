
// === n8n patch: dynamic imports with fallbacks ===
let ProjectService;
try {
  const m = await import('../../services/ProjectService.js');
  ProjectService = m.default ?? m;
} catch {
  ProjectService = {
    listFor: async () => [],
    createFor: async (_user, data) => ({ id: 'mock-project', ...data }),
    update: async (project, data) => ({ ...project, ...data }),
  };
}

let ProjectModel;
try {
  const m = await import('../../models/Project.js');
  ProjectModel = m.default ?? m;
} catch {
  ProjectModel = { findById: async (_id) => null };
}
// === end n8n patch ===

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function index(req, res, next) {
  try {
    // TODO: Implement ProjectService.listFor
    const data = await ProjectService.listFor(req.user);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function store(req, res, next) {
  try {
    // TODO: Implement ProjectService.createFor with req.user and req.body
    const project = await ProjectService.createFor(req.user, req.body);
    return res.status(201).json(project);
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
    const id = req.params.id;
    // TODO: Implement Project.with('tasks').findOrFail(id)
    const project = await Project.with('tasks').findOrFail(id);

    // TODO: Implement authorizeOwner(project, req.user?.id)
    if (!authorizeOwner(project, req.user?.id)) {
      return res.sendStatus(403);
    }

    return res.status(200).json(project);
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
    const id = req.params.id;
    // TODO: Implement Project.findOrFail(id)
    const project = await Project.findOrFail(id);

    // TODO: Implement authorizeOwner(project, req.user?.id)
    if (!authorizeOwner(project, req.user?.id)) {
      return res.sendStatus(403);
    }

    // TODO: Implement ProjectService.update
    const updated = await ProjectService.update(project, req.body);
    return res.status(200).json(updated);
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
    const id = req.params.id;
    // TODO: Implement Project.findOrFail(id)
    const project = await Project.findOrFail(id);

    // TODO: Implement authorizeOwner(project, req.user?.id)
    if (!authorizeOwner(project, req.user?.id)) {
      return res.sendStatus(403);
    }

    // TODO: Implement project.delete()
    await project.delete();
    return res.status(204).json();
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Project} project
 * @param {string|number} userId
 * @returns {boolean}
 */
function authorizeOwner(project, userId) {
  // TODO: Implement authorization logic
  return project.user_id === userId; // Replace with actual logic based on your Project model structure
}

export default {
  index,
  store,
  show,
  update,
  destroy,
};
