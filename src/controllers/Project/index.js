// src/controllers/Project/index.js

let nextProjectId = 1;
let nextTaskId = 1;

// Mocks en memoria para usuarios, proyectos y tareas
const users = [];
const projects = [];
const tasks = [];

// Helper para obtener parámetros de ruta de forma flexible
const getParam = (req, ...keys) => keys.map(k => req?.params?.[k]).find(v => v !== undefined);

// Helper para autorización de propiedad
const _authorizeOwner = (req, res, project) => {
  if (!req.user || req.user.id !== project.userId) {
    res.status(403).json({ message: 'No autorizado.' });
    return false;
  }
  return true;
};

export async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const userProjects = projects.filter(p => p.userId === req.user.id);
    return res.status(200).json(userProjects);
  } catch (e) {
    return next(e);
  }
}

export async function store(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const { name, description } = req.body;

    const newProject = {
      id: nextProjectId++,
      userId: req.user.id,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [] // Inicialmente sin tareas
    };

    projects.push(newProject);
    return res.status(201).json(newProject);
  } catch (e) {
    return next(e);
  }
}

export async function show(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParam(req, 'project', 'projectId', 'id');
    const project = projects.find(p => p.id === parseInt(projectId));

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!_authorizeOwner(req, res, project)) {
      return; // _authorizeOwner ya envió la respuesta
    }
    
    // Simula 'with tasks'
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    const projectWithTasks = { ...project, tasks: projectTasks };

    return res.status(200).json(projectWithTasks);
  } catch (e) {
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParam(req, 'project', 'projectId', 'id');
    const projectIndex = projects.findIndex(p => p.id === parseInt(projectId));

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    let project = projects[projectIndex];

    if (!_authorizeOwner(req, res, project)) {
      return; // _authorizeOwner ya envió la respuesta
    }

    const { name, description } = req.body;

    project = {
      ...project,
      ...(name && { name }),
      ...(description && { description }),
      updatedAt: new Date().toISOString()
    };
    projects[projectIndex] = project;

    return res.status(200).json(project);
  } catch (e) {
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParam(req, 'project', 'projectId', 'id');
    const projectIndex = projects.findIndex(p => p.id === parseInt(projectId));

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    const project = projects[projectIndex];

    if (!_authorizeOwner(req, res, project)) {
      return; // _authorizeOwner ya envió la respuesta
    }

    projects.splice(projectIndex, 1);
    
    // También eliminar tareas asociadas (si las hubiera en el mock de tareas)
    const tasksToDelete = tasks.filter(t => t.projectId === project.id);
    tasksToDelete.forEach(task => {
      const taskIndex = tasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) tasks.splice(taskIndex, 1);
    });

    return res.status(204).json({});
  } catch (e) {
    return next(e);
  }
}

// Exportar los arreglos en memoria para reutilización/pruebas
export const __users = users;
export const __projects = projects;
export const __tasks = tasks;

// Exportación por defecto para agrupar las funciones del controlador
export default {
  index,
  store,
  show,
  update,
  destroy,
};
