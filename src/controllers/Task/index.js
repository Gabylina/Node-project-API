/**
 * Task Controller - Generated from Laravel PHP to Express ESM.
 * Manages tasks with in-memory storage for demonstration.
 */

// --- In-memory Mocks ---
// These arrays will act as our temporary database.
let users = [];
let projects = [];
let tasks = [];

let nextUserId = 1;
let nextProjectId = 1;
let nextTaskId = 1;

// Enum-like definition for task statuses
const TaskStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
});
const ALL_TASK_STATUSES = Object.values(TaskStatus);

// --- Utility Functions ---
const getParam = (req, ...keys) => keys.map(k => req?.params?.[k]).find(v => v !== undefined);

/**
 * Middleware-like function for authorization check.
 * In a real app, this would be a separate middleware or service.
 */
const authorizeOwner = (req, res, project) => {
  if (!req.user || project.userId !== req.user.id) {
    res.status(403).json({ message: 'No autorizado.' });
    return false;
  }
  return true;
};

// --- Controller Functions ---

export async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParam(req, 'project', 'projectId', 'id');
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID es requerido.' });
    }

    const project = projects.find(p => p.id === parseInt(projectId));
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeOwner(req, res, project)) return;

    const projectTasks = tasks.filter(task => task.projectId === parseInt(projectId));
    return res.status(200).json(projectTasks);
  } catch (e) {
    return next(e);
  }
}

export async function store(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParam(req, 'project', 'projectId', 'id');
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID es requerido.' });
    }

    const project = projects.find(p => p.id === parseInt(projectId));
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeOwner(req, res, project)) return;

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título de la tarea es requerido.' });
    }

    const now = new Date().toISOString();
    const newTask = {
      id: nextTaskId++,
      projectId: parseInt(projectId),
      userId: req.user.id,
      title,
      description: description || null,
      status: TaskStatus.PENDING, // Default status
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
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
    const taskId = getParam(req, 'task', 'taskId', 'id');

    if (!projectId || !taskId) {
      return res.status(400).json({ message: 'IDs de proyecto y tarea son requeridos.' });
    }

    const project = projects.find(p => p.id === parseInt(projectId));
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeOwner(req, res, project)) return;

    const task = tasks.find(t => t.id === parseInt(taskId) && t.projectId === parseInt(projectId));
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
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParam(req, 'project', 'projectId', 'id');
    const taskId = getParam(req, 'task', 'taskId', 'id');

    if (!projectId || !taskId) {
      return res.status(400).json({ message: 'IDs de proyecto y tarea son requeridos.' });
    }

    const project = projects.find(p => p.id === parseInt(projectId));
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeOwner(req, res, project)) return;

    const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId) && t.projectId === parseInt(projectId));
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const task = tasks[taskIndex];
    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      if (!ALL_TASK_STATUSES.includes(status)) {
        return res.status(400).json({ message: `Estado inválido. Valores permitidos: ${ALL_TASK_STATUSES.join(', ')}` });
      }
      task.status = status;
    }

    task.updatedAt = new Date().toISOString();
    tasks[taskIndex] = task;

    return res.status(200).json(task);
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
    const taskId = getParam(req, 'task', 'taskId', 'id');

    if (!projectId || !taskId) {
      return res.status(400).json({ message: 'IDs de proyecto y tarea son requeridos.' });
    }

    const project = projects.find(p => p.id === parseInt(projectId));
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeOwner(req, res, project)) return;

    const initialLength = tasks.length;
    tasks = tasks.filter(t => !(t.id === parseInt(taskId) && t.projectId === parseInt(projectId)));

    if (tasks.length === initialLength) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    return res.status(204).json({}); // No content
  } catch (e) {
    return next(e);
  }
}

export async function changeStatus(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getParam(req, 'project', 'projectId', 'id');
    const taskId = getParam(req, 'task', 'taskId', 'id');

    if (!projectId || !taskId) {
      return res.status(400).json({ message: 'IDs de proyecto y tarea son requeridos.' });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'El estado es requerido.' });
    }
    if (!ALL_TASK_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Estado inválido. Valores permitidos: ${ALL_TASK_STATUSES.join(', ')}` });
    }

    const project = projects.find(p => p.id === parseInt(projectId));
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeOwner(req, res, project)) return;

    const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId) && t.projectId === parseInt(projectId));
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const task = tasks[taskIndex];
    task.status = status;
    task.updatedAt = new Date().toISOString();
    tasks[taskIndex] = task;

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

// --- Export Mocks for Reusability ---
export const __users = users;
export const __projects = projects;
export const __tasks = tasks;
export const __nextUserId = nextUserId;
export const __nextProjectId = nextProjectId;
export const __nextTaskId = nextTaskId;

// --- Default Export ---
export default {
  index,
  store,
  show,
  update,
  destroy,
  changeStatus,
  // Exposed for testing/resetting mocks
  __users: users,
  __projects: projects,
  __tasks: tasks,
  __resetMocks: () => {
    users = [];
    projects = [];
    tasks = [];
    nextUserId = 1;
    nextProjectId = 1;
    nextTaskId = 1;
  }
};
