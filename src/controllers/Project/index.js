// Minimal header for ESM module

let nextProjectId = 1;
const projects = []; // In-memory mock storage for projects

let nextUserId = 1;
const users = [
  // Mock user for testing authentication
  { id: nextUserId++, email: 'test@example.com', password: 'password123' },
  { id: nextUserId++, email: 'another@example.com', password: 'password123' },
];

/**
 * Helper to safely get a parameter from req.params.
 * @param {object} req - Express request object.
 * @param {...string} keys - Possible parameter keys to check.
 * @returns {string|number|undefined} The parameter value or undefined.
 */
const getParam = (req, ...keys) => {
  if (!req?.params) return undefined;
  for (const key of keys) {
    if (req.params[key] !== undefined) {
      return req.params[key];
    }
  }
  return undefined;
};

/**
 * Ensures the request is authenticated.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {boolean} True if authenticated, false otherwise (and sends 401).
 */
const ensureAuthenticated = (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'No autenticado' });
    return false;
  }
  return true;
};

/**
 * Authorizes a user to access a specific project.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {object} project - The project object.
 * @returns {boolean} True if authorized, false otherwise (and sends 403).
 */
const authorizeProjectOwner = (req, res, project) => {
  if (req.user.id !== project.userId) {
    res.status(403).json({ message: 'No autorizado' });
    return false;
  }
  return true;
};

/**
 * Lists projects for the authenticated user.
 * GET /api/projects
 */
export async function index(req, res, next) {
  try {
    if (!ensureAuthenticated(req, res)) return;

    const userProjects = projects.filter(p => p.userId === req.user.id);
    return res.status(200).json(userProjects);
  } catch (e) {
    next(e);
  }
}

/**
 * Creates a new project for the authenticated user.
 * POST /api/projects
 */
export async function store(req, res, next) {
  try {
    if (!ensureAuthenticated(req, res)) return;

    const { name, description } = req.body; // Assuming name and description from validated request
    if (!name) {
      return res.status(400).json({ message: 'El campo nombre es requerido.' });
    }

    const newProject = {
      id: nextProjectId++,
      name,
      description: description || null,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Mock for tasks relationship from PHP
      tasks: []
    };
    projects.push(newProject);

    return res.status(201).json(newProject);
  } catch (e) {
    next(e);
  }
}

/**
 * Displays a specific project.
 * GET /api/projects/:id
 */
export async function show(req, res, next) {
  try {
    if (!ensureAuthenticated(req, res)) return;

    const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    };

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeProjectOwner(req, res, project)) return;

    // Simulate 'with tasks' by adding a mock tasks array to the project object
    // In a real app, this would involve fetching from a separate tasks array/model.
    const projectWithTasks = { ...project, tasks: [] }; // Mock tasks

    return res.status(200).json(projectWithTasks);
  } catch (e) {
    next(e);
  }
}

/**
 * Updates an existing project.
 * PUT /api/projects/:id
 */
export async function update(req, res, next) {
  try {
    if (!ensureAuthenticated(req, res)) return;

    const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    const project = projects[projectIndex];
    if (!authorizeProjectOwner(req, res, project)) return;

    const { name, description } = req.body; // Assuming name and description from validated request
    if (name === undefined && description === undefined) {
      return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar (nombre o descripción).' });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    project.updatedAt = new Date().toISOString();

    projects[projectIndex] = project; // Update in place

    return res.status(200).json(project);
  } catch (e) {
    next(e);
  }
}

/**
 * Deletes a project.
 * DELETE /api/projects/:id
 */
export async function destroy(req, res, next) {
  try {
    if (!ensureAuthenticated(req, res)) return;

    const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    const projectToDelete = projects[projectIndex];
    if (!authorizeProjectOwner(req, res, projectToDelete)) return;

    projects.splice(projectIndex, 1); // Remove from array

    return res.status(204).json({}); // No content, but explicit empty object for consistency
  } catch (e) {
    next(e);
  }
}

// Export the in-memory mock arrays
export const __projects = projects;
export const __users = users;

// Default export grouping all functions
export default {
  index,
  store,
  show,
  update,
  destroy,
};
