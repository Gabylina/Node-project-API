// src/controllers/Project/index.js

// Mock data storage
const projects = [];
let projectIdCounter = 1;

// Mock users and tasks to support related functionality (even if simple)
const users = []; // Populated by an assumed AuthController
let userIdCounter = 1; // For potential use by AuthController
const tasks = []; // Populated by an assumed TaskController
let taskIdCounter = 1; // For potential use by TaskController

// Helper to extract project ID from request parameters
const getProjectId = (req) => req.params?.project ?? req.params?.projectId ?? req.params?.id;

// Helper function for authorization logic
const authorizeOwner = (req, res, project) => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'No autenticado' });
    return false;
  }
  if (project.userId !== req.user.id) {
    res.status(403).json({ message: 'No autorizado' });
    return false;
  }
  return true;
};

export async function index(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const userProjects = projects.filter(p => p.userId === req.user.id);
    return res.status(200).json(userProjects);
  } catch (e) {
    next(e);
  }
}

export async function store(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'El nombre del proyecto es requerido.' });
    }

    const newProject = {
      id: projectIdCounter++,
      userId: req.user.id,
      name,
      description: description || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    projects.push(newProject);
    return res.status(201).json(newProject);
  } catch (e) {
    next(e);
  }
}

export async function show(req, res, next) {
  try {
    const projectId = getProjectId(req);
    const project = projects.find(p => p.id == projectId); // Use == for loose comparison if IDs might be mixed type

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeOwner(req, res, project)) {
      return; // authorizeOwner already sent a response
    }

    // Mock tasks relation by filtering from global tasks array
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    const projectWithTasks = { ...project, tasks: projectTasks };

    return res.status(200).json(projectWithTasks);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const projectId = getProjectId(req);
    const projectIndex = projects.findIndex(p => p.id == projectId);

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    const project = projects[projectIndex];

    if (!authorizeOwner(req, res, project)) {
      return; // authorizeOwner already sent a response
    }

    const { name, description } = req.body;
    
    // Only update provided fields
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    
    project.updated_at = new Date().toISOString();

    // Reassign to ensure reactivity if `projects` was a stateful object (not strictly necessary for plain array)
    projects[projectIndex] = project;

    return res.status(200).json(project);
  } catch (e) {
    next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    const projectId = getProjectId(req);
    const projectIndex = projects.findIndex(p => p.id == projectId);

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    const project = projects[projectIndex];

    if (!authorizeOwner(req, res, project)) {
      return; // authorizeOwner already sent a response
    }

    projects.splice(projectIndex, 1);
    return res.status(204).json({}); // 204 No Content, typically an empty object as body per requirement
  } catch (e) {
    next(e);
  }
}

// Export internal mock arrays for potential reuse by other controllers/tests
export const __projects = projects;
export const __users = users;
export const __tasks = tasks;

// Group all functions into a default export
export default {
  index,
  store,
  show,
  update,
  destroy,
};
