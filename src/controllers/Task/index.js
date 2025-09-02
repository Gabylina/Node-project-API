// Task controller for Express (ESM)

// --- Mocks for dependencies --- 
// In a real application, these would be imported from service/model layers
const mockProjects = [
  { id: 'proj-1', name: 'Project Alpha', user_id: 'user-1' },
  { id: 'proj-2', name: 'Project Beta', user_id: 'user-2' }
];

let taskIdCounter = 100; // Simple counter for mock task IDs
let mockTasks = [
  { id: 'task-1', project_id: 'proj-1', title: 'Implement login', status: 'pending', description: 'User authentication', user_id: 'user-1' },
  { id: 'task-2', project_id: 'proj-1', title: 'Design DB schema', status: 'completed', description: 'Table structures', user_id: 'user-1' },
  { id: 'task-3', project_id: 'proj-2', title: 'Setup CI/CD', status: 'in-progress', description: 'Automate deployments', user_id: 'user-2' }
];

const mockTaskService = {
  list: (project) => {
    return mockTasks.filter(t => t.project_id === project.id);
  },
  create: (project, data) => {
    const newTask = {
      id: `task-${++taskIdCounter}`,
      project_id: project.id,
      user_id: project.user_id, // Assuming task owner is project owner
      status: 'pending', // Default status
      ...data
    };
    mockTasks.push(newTask);
    return newTask;
  },
  update: (task, data) => {
    const index = mockTasks.findIndex(t => t.id === task.id);
    if (index === -1) return null; 
    mockTasks[index] = { ...mockTasks[index], ...data };
    return mockTasks[index];
  }
};

const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked'
};
const taskStatusValues = Object.values(TaskStatus);

// --- Helper functions --- 
const getParam = (req, ...keys) => keys.map(k=>req?.params?.[k]).find(v=>v!==undefined);

class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

const findProjectOrFail = (projectId) => {
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) {
    throw new HttpError('Project not found', 404);
  }
  return project;
};

const findTaskOrFail = (projectId, taskId) => {
  const task = mockTasks.find(t => t.project_id === projectId && t.id === taskId);
  if (!task) {
    throw new HttpError('Task not found', 404);
  }
  return task;
};

const authorizeOwner = (req, project) => {
  if (!req.user || req.user.id !== project.user_id) {
    throw new HttpError('No autorizado', 403);
  }
};

// --- Controller functions --- 

export async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const projectId = getParam(req, 'project', 'projectId', 'id');
    const project = findProjectOrFail(projectId);
    authorizeOwner(req, project);
    const tasks = mockTaskService.list(project);
    return res.status(200).json(tasks);
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
    const project = findProjectOrFail(projectId);
    authorizeOwner(req, project);

    if (!req.body.title || !req.body.description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }
    
    const task = mockTaskService.create(project, req.body);
    return res.status(201).json(task);
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
    const project = findProjectOrFail(projectId);
    authorizeOwner(req, project);
    const task = findTaskOrFail(projectId, taskId);
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
    const project = findProjectOrFail(projectId);
    authorizeOwner(req, project);
    const task = findTaskOrFail(projectId, taskId);

    const allowedFields = ['title', 'description', 'status'];
    const updates = {};
    for (const field of allowedFields) {
        if (req.body?.[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    const updated = mockTaskService.update(task, updates);
    return res.status(200).json(updated);
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
    const project = findProjectOrFail(projectId);
    authorizeOwner(req, project);
    const task = findTaskOrFail(projectId, taskId);

    mockTasks = mockTasks.filter(t => t.id !== task.id);
    return res.status(204).json({});
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
    const project = findProjectOrFail(projectId);
    authorizeOwner(req, project);
    const task = findTaskOrFail(projectId, taskId);

    const newStatus = req.body?.status;
    if (!newStatus || !taskStatusValues.includes(newStatus)) {
      return res.status(400).json({
        message: 'Estado inválido',
        valid_statuses: taskStatusValues
      });
    }

    const updated = mockTaskService.update(task, { status: newStatus });
    return res.status(200).json(updated);
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
  changeStatus
};
