const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;
const projects = MEM.projects;
const tasks = MEM.tasks;

const normalizeStatus = s => {
  const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
  return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

// Helper for finding project and authorizing
const getAuthorizedProject = (projectId, userId) => {
  if (isNaN(projectId)) {
    const error = new Error('ID de proyecto inválido');
    error.status = 400;
    throw error;
  }
  const project = projects.find(p => p.id === projectId);
  if (!project) {
    const error = new Error('Proyecto no encontrado');
    error.status = 404;
    throw error;
  }
  if (project.userId !== userId) {
    const error = new Error('No autorizado para acceder a este proyecto');
    error.status = 403;
    throw error;
  }
  return project;
};

// Helper for finding task within an authorized project
const getTaskFromProject = (projectId, taskId) => {
  if (isNaN(taskId)) {
    const error = new Error('ID de tarea inválido');
    error.status = 400;
    throw error;
  }
  const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
  if (!task) {
    const error = new Error('Tarea no encontrada');
    error.status = 404;
    throw error;
  }
  return task;
};


export async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const projectId = Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);
    const project = getAuthorizedProject(projectId, req.user.id);

    const projectTasks = tasks.filter(t => t.projectId === project.id);
    return res.status(200).json(projectTasks);
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({ message: e.message });
    }
    return next(e);
  }
}

export async function store(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const projectId = Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);
    const project = getAuthorizedProject(projectId, req.user.id);

    const { title, description, status } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'El título es requerido.' });
    }

    const now = new Date().toISOString();
    const newTask = {
      id: MEM.seq.task++,
      projectId: project.id,
      userId: req.user.id,
      title,
      description: description ?? null,
      status: normalizeStatus(status ?? 'pending'),
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({ message: e.message });
    }
    return next(e);
  }
}

export async function show(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const projectId = Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);
    const taskId    = Number(req.params?.task    ?? req.params?.taskId    ?? req.params?.id);

    const project = getAuthorizedProject(projectId, req.user.id);
    const task = getTaskFromProject(project.id, taskId);

    return res.status(200).json(task);
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({ message: e.message });
    }
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const projectId = Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);
    const taskId    = Number(req.params?.task    ?? req.params?.taskId    ?? req.params?.id);

    const project = getAuthorizedProject(projectId, req.user.id);
    const task = getTaskFromProject(project.id, taskId);

    const { title, description, status } = req.body;
    
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = normalizeStatus(status);
    
    task.updatedAt = new Date().toISOString();

    return res.status(200).json(task);
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({ message: e.message });
    }
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const projectId = Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);
    const taskId    = Number(req.params?.task    ?? req.params?.taskId    ?? req.params?.id);

    const project = getAuthorizedProject(projectId, req.user.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === project.id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    tasks.splice(taskIndex, 1);
    return res.status(204).json({});
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({ message: e.message });
    }
    return next(e);
  }
}

export async function changeStatus(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const projectId = Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);
    const taskId    = Number(req.params?.task    ?? req.params?.taskId    ?? req.params?.id);

    const project = getAuthorizedProject(projectId, req.user.id);
    const task = getTaskFromProject(project.id, taskId);

    const newStatus = normalizeStatus(req.body?.status);
    if (!req.body?.status || !['pending', 'in-progress', 'completed'].includes(newStatus)) {
        return res.status(400).json({ message: 'El estado es requerido y debe ser "pending", "in-progress" o "completed".' });
    }
    
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();

    return res.status(200).json(task);
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({ message: e.message });
    }
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

export const __users = MEM.users;
export const __projects = MEM.projects;
export const __tasks = MEM.tasks;
