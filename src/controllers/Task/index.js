// TaskController - Manejo de tareas en memoria
let tasks = [];
let projects = [
  { id: 1, name: 'Project Alpha', userId: 1, description: 'First test project' },
  { id: 2, name: 'Project Beta', userId: 2, description: 'Second test project' }
];
let nextTaskId = 1;

const TASK_STATUS_ENUM = ['pending', 'in-progress', 'completed'];

const getParam = (req, ...keys) => {
  for (const key of keys) {
    if (req.params?.[key] !== undefined) {
      return req.params[key];
    }
  }
  return undefined;
};

const ensureAuthorized = (req, res, project) => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'No autenticado' });
    return false;
  }
  if (req.user.id !== project.userId) {
    res.status(403).json({ message: 'No autorizado' });
    return false;
  }
  return true;
};

export async function index(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID es requerido.' });
    }

    const project = projects.find(p => p.id == projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!ensureAuthorized(req, res, project)) {
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
    const { title, description, status = 'pending' } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID es requerido.' });
    }
    if (!title) {
        return res.status(400).json({ message: 'El título de la tarea es requerido.' });
    }
    if (!TASK_STATUS_ENUM.includes(status)) {
        return res.status(400).json({ message: `Estado inválido. Valores permitidos: ${TASK_STATUS_ENUM.join(', ')}` });
    }

    const project = projects.find(p => p.id == projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!ensureAuthorized(req, res, project)) {
      return;
    }

    const newTask = {
      id: nextTaskId++,
      projectId: parseInt(projectId),
      userId: project.userId,
      title,
      description: description ?? null,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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

    if (!projectId || !taskId) {
      return res.status(400).json({ message: 'Project ID y Task ID son requeridos.' });
    }

    const project = projects.find(p => p.id == projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!ensureAuthorized(req, res, project)) {
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
    const { title, description, status } = req.body;

    if (!projectId || !taskId) {
      return res.status(400).json({ message: 'Project ID y Task ID son requeridos.' });
    }
    if (status && !TASK_STATUS_ENUM.includes(status)) {
        return res.status(400).json({ message: `Estado inválido. Valores permitidos: ${TASK_STATUS_ENUM.join(', ')}` });
    }

    const project = projects.find(p => p.id == projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!ensureAuthorized(req, res, project)) {
      return;
    }

    const taskIndex = tasks.findIndex(t => t.id == taskId && t.projectId == projectId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const existingTask = tasks[taskIndex];
    const updatedTask = {
      ...existingTask,
      title: title ?? existingTask.title,
      description: description ?? existingTask.description,
      status: status ?? existingTask.status,
      updatedAt: new Date().toISOString()
    };
    tasks[taskIndex] = updatedTask;

    return res.status(200).json(updatedTask);
  } catch (e) {
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    const taskId = getParam(req, 'task', 'taskId', 'id');

    if (!projectId || !taskId) {
      return res.status(400).json({ message: 'Project ID y Task ID son requeridos.' });
    }

    const project = projects.find(p => p.id == projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!ensureAuthorized(req, res, project)) {
      return;
    }

    const initialLength = tasks.length;
    tasks = tasks.filter(t => !(t.id == taskId && t.projectId == projectId));

    if (tasks.length === initialLength) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    return res.status(204).json({});
  } catch (e) {
    return next(e);
  }
}

export async function changeStatus(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    const taskId = getParam(req, 'task', 'taskId', 'id');
    const { status } = req.body;

    if (!projectId || !taskId) {
      return res.status(400).json({ message: 'Project ID y Task ID son requeridos.' });
    }
    if (!status || !TASK_STATUS_ENUM.includes(status)) {
      return res.status(400).json({ message: `Estado inválido. Valores permitidos: ${TASK_STATUS_ENUM.join(', ')}` });
    }

    const project = projects.find(p => p.id == projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!ensureAuthorized(req, res, project)) {
      return;
    }

    const taskIndex = tasks.findIndex(t => t.id == taskId && t.projectId == projectId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const existingTask = tasks[taskIndex];
    const updatedTask = {
      ...existingTask,
      status,
      updatedAt: new Date().toISOString()
    };
    tasks[taskIndex] = updatedTask;

    return res.status(200).json(updatedTask);
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
  changeStatus,
};