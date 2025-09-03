// Project Controller - ESM module for Express

const projects = []; // In-memory storage for projects
let projectIdCounter = 0;

// Helper to get parameters from route, supporting aliases
const getParam = (req, ...keys) => {
  for (const key of keys) {
    if (req?.params?.[key] !== undefined) {
      return req.params[key];
    }
  }
  return undefined;
};

/**
 * Lists projects for the authenticated user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function index(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const userProjects = projects.filter(p => p.userId === userId);
    return res.status(200).json(userProjects);
  } catch (e) {
    return next(e);
  }
}

/**
 * Stores a new project for the authenticated user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function store(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    projectIdCounter++;
    const newProject = {
      id: projectIdCounter,
      userId: userId,
      ...req.body, // Assume req.body contains validated data
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    projects.push(newProject);

    return res.status(201).json(newProject);
  } catch (e) {
    return next(e);
  }
}

/**
 * Displays a specific project.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function show(req, res, next) {
  try {
    const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
    const userId = req.user?.id;

    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto no válido.' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    // Authorization check
    if (project.userId !== userId) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    return res.status(200).json(project);
  } catch (e) {
    return next(e);
  }
}

/**
 * Updates a specific project.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function update(req, res, next) {
  try {
    const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
    const userId = req.user?.id;

    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto no válido.' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    // Authorization check
    if (projects[projectIndex].userId !== userId) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const updatedProject = {
      ...projects[projectIndex],
      ...req.body, // Assume req.body contains validated data
      updated_at: new Date().toISOString(),
      id: projectId, // Ensure ID remains the same
      userId: userId // Ensure userId remains the same
    };
    projects[projectIndex] = updatedProject;

    return res.status(200).json(updatedProject);
  } catch (e) {
    return next(e);
  }
}

/**
 * Deletes a specific project.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function destroy(req, res, next) {
  try {
    const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
    const userId = req.user?.id;

    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto no válido.' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    // Authorization check
    if (projects[projectIndex].userId !== userId) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    projects.splice(projectIndex, 1);

    return res.status(204).json({}); // No content
  } catch (e) {
    return next(e);
  }
}

export default {
  index,
  store,
  show,
  update,
  destroy,
};
