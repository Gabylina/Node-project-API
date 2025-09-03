const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;
const projects = MEM.projects;
const tasks = MEM.tasks;

const getParam = (req, ...keys) => {
  for (const key of keys) {
    if (req?.params?.[key] !== undefined) {
      return req.params[key];
    }
  }
  return undefined;
};

const normalizeStatus = s => {
  const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
  return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

const getProjectAndAuthorize = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'No autenticado' });
    return null;
  }

  const projectId = Number(getParam(req, 'project', 'projectId', 'id'));
  if (isNaN(projectId) || projectId <= 0) {
    res.status(400).json({ message: 'ID de proyecto inválido' });
    return null;
  }

  const project = projects.find(p => p.id === projectId);
  if (!project) {
    res.status(404).json({ message: 'Proyecto no encontrado' });
    return null;
  }

  if (project.userId !== req.user.id) {
    res.status(403).json({ message: 'No autorizado para este proyecto' });
    return null;
  }
  return project;
};

const getTaskAndAuthorize = (req, res, project) => {
  const taskId = Number(getParam(req, 'task', 'taskId', 'id'));
  if (isNaN(taskId) || taskId <= 0) {
    res.status(400).json({ message: 'ID de tarea inválido' });
    return null;
  }

  const task = tasks.find(t => t.id === taskId && t.projectId === project.id);
  if (!task) {
    res.status(404).json({ message: 'Tarea no encontrada' });
    return null;
  }
  return task;
};

export async function index(req, res, next) {
  try {
    const project = getProjectAndAuthorize(req, res);
    if (!project) return;

    const projectTasks = tasks.filter(t => t.projectId === project.id);
    return res.status(200).json(projectTasks);
  } catch (e) {
    return next(e);
  }
}

export async function store(req, res, next) {
  try {
    const project = getProjectAndAuthorize(req, res);
    if (!project) return;

    const { name, description, status } = req.body;

    if (!name || String(name).trim() === '') {
      return res.status(400).json({ message: 'El nombre de la tarea es requerido' });
    }

    const newTask = {
      id: MEM.seq.task++,
      projectId: project.id,
      userId: req.user.id,
      name,
      description: description ?? null,
      status: normalizeStatus(status ?? 'pending'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
  } catch (e) {
    return next(e);
  }
}

export async function show(req, res, next) {
  try {
    const project = getProjectAndAuthorize(req, res);
    if (!project) return;

    const task = getTaskAndAuthorize(req, res, project);
    if (!task) return;

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    const project = getProjectAndAuthorize(req, res);
    if (!project) return;

    const task = getTaskAndAuthorize(req, res, project);
    if (!task) return;

    const { name, description, status } = req.body;

    if (name !== undefined) {
        if (String(name).trim() === '') return res.status(400).json({ message: 'El nombre de la tarea no puede estar vacío' });
        task.name = name;
    }
    if (description !== undefined) task.description = description ?? null;
    if (status !== undefined) task.status = normalizeStatus(status);

    task.updatedAt = new Date().toISOString();

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    const project = getProjectAndAuthorize(req, res);
    if (!project) return;

    const task = getTaskAndAuthorize(req, res, project);
    if (!task) return;

    const taskIndex = tasks.findIndex(t => t.id === task.id);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
    }

    return res.status(204).json({});
  } catch (e) {
    return next(e);
  }
}

export async function changeStatus(req, res, next) {
  try {
    const project = getProjectAndAuthorize(req, res);
    if (!project) return;

    const task = getTaskAndAuthorize(req, res, project);
    if (!task) return;

    const { status } = req.body;

    if (status === undefined || status === null || String(status).trim() === '') {
      return res.status(400).json({ message: 'El estado es requerido' });
    }

    const inputStatusLower = String(status).toLowerCase();
    const validRawStatuses = ['pending', 'in_progress', 'in-progress', 'completed'];

    if (!validRawStatuses.includes(inputStatusLower)) {
        return res.status(400).json({ message: 'Estado inválido. Valores permitidos: pending, in-progress, completed (o in_progress)' });
    }

    task.status = normalizeStatus(status);
    task.updatedAt = new Date().toISOString();

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

const TaskController = {
  index,
  store,
  show,
  update,
  destroy,
  changeStatus,
};

export default TaskController;

export const __tasks = MEM.tasks;
export const __projects = MEM.projects;
export const __users = MEM.users;
