// src/controllers/Task/index.js

// In-memory data stores for mocking
let userIdCounter = 1;
let projectIdCounter = 1;
let taskIdCounter = 1;

const users = [
  { id: userIdCounter++, email: 'test@example.com', password: 'password', name: 'Test User' }
];
const projects = [
  { id: projectIdCounter++, name: 'Sample Project', userId: users[0].id }
];
const tasks = [
  { id: taskIdCounter++, projectId: projects[0].id, userId: users[0].id, title: 'Initial Task', description: 'This is a sample task.', status: 'pending' }
];

// Enum for TaskStatus
const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};
const validTaskStatuses = Object.values(TaskStatus);

// Helper to get route parameters with aliases
const getParam = (req, ...keys) => keys.map(k => req?.params?.[k]).find(v => v !== undefined);

// Internal authorization helper
const _authorizeOwner = (req, res, project) => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'No autenticado' });
    return false;
  }
  if (req.user.id !== project.userId) {
    res.status(403).json({ message: 'No autorizado.' });
    return false;
  }
  return true;
};

export async function index(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    const project = projects.find(p => p.id == projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projecto no encontrado.' });
    }

    if (!_authorizeOwner(req, res, project)) {
      return;
    }

    const projectTasks = tasks.filter(task => task.projectId == projectId);
    return res.status(200).json(projectTasks);
  } catch (e) {
    return next(e);
  }
}

export async function store(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    const project = projects.find(p => p.id == projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projecto no encontrado.' });
    }

    if (!_authorizeOwner(req, res, project)) {
      return;
    }

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    const { title, description, status = TaskStatus.PENDING } = req.body;

    // Basic validation
    if (!title) {
        return res.status(400).json({ message: 'El título de la tarea es requerido.' });
    }
    if (!validTaskStatuses.includes(status)) {
      return res.status(400).json({ message: `Estado de tarea inválido. Usar: ${validTaskStatuses.join(', ')}` });
    }

    const newTask = {
      id: taskIdCounter++,
      projectId: project.id,
      userId: req.user.id,
      title,
      description: description || null,
      status
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
  } catch (e) {
    return next(e);
  }
}

export async function show(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    const taskId = getParam(req, 'task', 'taskId', 'id');

    const project = projects.find(p => p.id == projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projecto no encontrado.' });
    }

    if (!_authorizeOwner(req, res, project)) {
      return;
    }

    const task = tasks.find(t => t.id == taskId && t.projectId == projectId);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    const taskId = getParam(req, 'task', 'taskId', 'id');

    const project = projects.find(p => p.id == projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projecto no encontrado.' });
    }

    if (!_authorizeOwner(req, res, project)) {
      return;
    }

    const taskIndex = tasks.findIndex(t => t.id == taskId && t.projectId == projectId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const task = tasks[taskIndex];
    const { title, description, status } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) {
      if (!validTaskStatuses.includes(status)) {
        return res.status(400).json({ message: `Estado de tarea inválido. Usar: ${validTaskStatuses.join(', ')}` });
      }
      task.status = status;
    }

    tasks[taskIndex] = task;
    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    const taskId = getParam(req, 'task', 'taskId', 'id');

    const project = projects.find(p => p.id == projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projecto no encontrado.' });
    }

    if (!_authorizeOwner(req, res, project)) {
      return;
    }

    const taskIndex = tasks.findIndex(t => t.id == taskId && t.projectId == projectId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    tasks.splice(taskIndex, 1);
    return res.status(204).json({});
  } catch (e) {
    return next(e);
  }
}

export async function changeStatus(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    const taskId = getParam(req, 'task', 'taskId', 'id');

    const project = projects.find(p => p.id == projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projecto no encontrado.' });
    }

    if (!_authorizeOwner(req, res, project)) {
      return;
    }

    const taskIndex = tasks.findIndex(t => t.id == taskId && t.projectId == projectId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const { status } = req.body;

    if (!status || !validTaskStatuses.includes(status)) {
      return res.status(400).json({ message: `Estado de tarea inválido. Usar: ${validTaskStatuses.join(', ')}` });
    }

    const task = tasks[taskIndex];
    task.status = status;

    tasks[taskIndex] = task;
    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

// Export in-memory arrays for other controllers/routes to reuse
export const __users = users;
export const __projects = projects;
export const __tasks = tasks;

// Default export for the controller module
export default {
  index,
  store,
  show,
  update,
  destroy,
  changeStatus
};
