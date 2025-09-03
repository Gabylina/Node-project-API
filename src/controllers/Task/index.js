const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });
const users = MEM.users;
const projects = MEM.projects;
const tasks = MEM.tasks;

// Helper to normalize task status, handling 'in_progress' alias and defaulting to 'pending'
const normalizeStatus = s => {
  const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
  return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

// Internal helper to get, validate, and authorize project/task access
const getAuthorizedProjectAndTask = (req, projectIdParam, taskIdParam = null) => {
  if (!req.user) {
    throw { status: 401, message: 'No autenticado' };
  }

  const userId = req.user.id;

  const projectId = Number(projectIdParam);
  if (isNaN(projectId) || projectId <= 0) {
    throw { status: 400, message: 'ID de proyecto inválido' };
  }

  const project = projects.find(p => p.id === projectId);
  if (!project) {
    throw { status: 404, message: 'Proyecto no encontrado' };
  }

  if (project.userId !== userId) {
    throw { status: 403, message: 'No autorizado para este proyecto' };
  }

  let task = null;
  let taskIndex = -1;
  if (taskIdParam !== null) {
    const taskId = Number(taskIdParam);
    if (isNaN(taskId) || taskId <= 0) {
      throw { status: 400, message: 'ID de tarea inválido' };
    }
    taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
    if (taskIndex === -1) {
      throw { status: 404, message: 'Tarea no encontrada' };
    }
    task = tasks[taskIndex];
  }

  return { project, task, taskIndex };
};

export async function index(req, res, next) {
  try {
    const projectIdParam = req.params?.project ?? req.params?.projectId ?? req.params?.id;
    const { project } = getAuthorizedProjectAndTask(req, projectIdParam);

    const projectTasks = tasks.filter(t => t.projectId === project.id);
    return res.status(200).json(projectTasks);
  } catch (e) {
    return next(e.status ? e : new Error(e.message));
  }
}

export async function store(req, res, next) {
  try {
    const projectIdParam = req.params?.project ?? req.params?.projectId ?? req.params?.id;
    const { project } = getAuthorizedProjectAndTask(req, projectIdParam);

    const { title, description, status } = req.body;

    if (!title) {
      throw { status: 400, message: 'El título de la tarea es requerido.' };
    }

    const newTask = {
      id: MEM.seq.task++,
      projectId: project.id,
      userId: req.user.id,
      title,
      description: description ?? null,
      status: normalizeStatus(status ?? 'pending'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
  } catch (e) {
    return next(e.status ? e : new Error(e.message));
  }
}

export async function show(req, res, next) {
  try {
    const projectIdParam = req.params?.project ?? req.params?.projectId;
    const taskIdParam = req.params?.task ?? req.params?.taskId ?? req.params?.id;
    const { task } = getAuthorizedProjectAndTask(req, projectIdParam, taskIdParam);

    return res.status(200).json(task);
  } catch (e) {
    return next(e.status ? e : new Error(e.message));
  }
}

export async function update(req, res, next) {
  try {
    const projectIdParam = req.params?.project ?? req.params?.projectId;
    const taskIdParam = req.params?.task ?? req.params?.taskId ?? req.params?.id;
    const { task, taskIndex } = getAuthorizedProjectAndTask(req, projectIdParam, taskIdParam);

    const { title, description, status } = req.body;
    const updatedTask = { ...task };

    if (title !== undefined) {
      updatedTask.title = title;
    }
    if (description !== undefined) {
      updatedTask.description = description;
    }
    if (status !== undefined) {
      updatedTask.status = normalizeStatus(status);
    }
    updatedTask.updatedAt = new Date().toISOString();

    tasks[taskIndex] = updatedTask;

    return res.status(200).json(updatedTask);
  } catch (e) {
    return next(e.status ? e : new Error(e.message));
  }
}

export async function destroy(req, res, next) {
  try {
    const projectIdParam = req.params?.project ?? req.params?.projectId;
    const taskIdParam = req.params?.task ?? req.params?.taskId ?? req.params?.id;
    const { taskIndex } = getAuthorizedProjectAndTask(req, projectIdParam, taskIdParam);

    tasks.splice(taskIndex, 1);
    return res.status(204).json({});
  } catch (e) {
    return next(e.status ? e : new Error(e.message));
  }
}

export async function changeStatus(req, res, next) {
  try {
    const projectIdParam = req.params?.project ?? req.params?.projectId;
    const taskIdParam = req.params?.task ?? req.params?.taskId ?? req.params?.id;
    const { task, taskIndex } = getAuthorizedProjectAndTask(req, projectIdParam, taskIdParam);

    const { status } = req.body;
    if (status === undefined) {
      throw { status: 400, message: 'El estado es requerido.' };
    }

    // Explicit validation check for allowed status values
    const validRawStatuses = ['pending', 'in_progress', 'completed'];
    const lowerStatus = String(status).toLowerCase();
    if (!validRawStatuses.includes(lowerStatus)) {
        throw { status: 400, message: `Estado inválido: '${status}'. Debe ser uno de: pending, in_progress, completed.` };
    }

    const newStatus = normalizeStatus(status); // Normalize valid status
    
    const updatedTask = { ...task, status: newStatus, updatedAt: new Date().toISOString() };
    tasks[taskIndex] = updatedTask;

    return res.status(200).json(updatedTask);
  } catch (e) {
    return next(e.status ? e : new Error(e.message));
  }
}

// Export all public functions individually
export {
  index,
  store,
  show,
  update,
  destroy,
  changeStatus,
};

// Export a default object grouping all functions
export default {
  index,
  store,
  show,
  update,
  destroy,
  changeStatus,
};

// Export MEM aliases
export const __users = MEM.users;
export const __projects = MEM.projects;
export const __tasks = MEM.tasks;
