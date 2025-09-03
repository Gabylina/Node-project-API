const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;
const projects = MEM.projects;
const tasks = MEM.tasks;

const normalizeStatus = s => {
  const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
  return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

const getNumParam = (req, key1, key2 = null, key3 = null) => {
    const val = Number(req.params?.[key1] ?? req.params?.[key2] ?? req.params?.[key3]);
    if (isNaN(val) || val <= 0) {
        return null;
    }
    return val;
};

const authorizeProjectAccess = (req, res, projectId) => {
    if (!req.user) {
        res.status(401).json({ message: 'No autenticado' });
        return false;
    }
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        res.status(404).json({ message: 'Proyecto no encontrado' });
        return false;
    }
    if (project.userId !== req.user.id) {
        res.status(403).json({ message: 'No autorizado' });
        return false;
    }
    return project;
};

export async function index(req, res, next) {
    try {
        const projectId = getNumParam(req, 'projectId', 'project', 'id');
        if (projectId === null) {
            return res.status(400).json({ message: 'ID de proyecto inválido' });
        }

        const project = authorizeProjectAccess(req, res, projectId);
        if (!project) return;

        const projectTasks = tasks.filter(t => t.projectId === projectId);
        return res.status(200).json(projectTasks);
    } catch (e) {
        return next(e);
    }
}

export async function store(req, res, next) {
    try {
        const projectId = getNumParam(req, 'projectId', 'project', 'id');
        if (projectId === null) {
            return res.status(400).json({ message: 'ID de proyecto inválido' });
        }

        const project = authorizeProjectAccess(req, res, projectId);
        if (!project) return;

        const { title, description, status } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'El título es requerido.' });
        }

        const newTask = {
            id: MEM.seq.task++,
            projectId: projectId,
            userId: req.user.id,
            title: title,
            description: description || null,
            status: normalizeStatus(status),
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
        const projectId = getNumParam(req, 'projectId', 'project');
        const taskId = getNumParam(req, 'taskId', 'task', 'id');
        if (projectId === null || taskId === null) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos' });
        }

        const project = authorizeProjectAccess(req, res, projectId);
        if (!project) return;

        const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export async function update(req, res, next) {
    try {
        const projectId = getNumParam(req, 'projectId', 'project');
        const taskId = getNumParam(req, 'taskId', 'task', 'id');
        if (projectId === null || taskId === null) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos' });
        }

        const project = authorizeProjectAccess(req, res, projectId);
        if (!project) return;

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        const task = tasks[taskIndex];
        const { title, description, status } = req.body;

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = normalizeStatus(status);

        task.updatedAt = new Date().toISOString();

        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export async function destroy(req, res, next) {
    try {
        const projectId = getNumParam(req, 'projectId', 'project');
        const taskId = getNumParam(req, 'taskId', 'task', 'id');
        if (projectId === null || taskId === null) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos' });
        }

        const project = authorizeProjectAccess(req, res, projectId);
        if (!project) return;

        const initialLength = tasks.length;
        MEM.tasks = tasks.filter(t => !(t.id === taskId && t.projectId === projectId));

        if (MEM.tasks.length === initialLength) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        return res.status(204).json({});
    } catch (e) {
        return next(e);
    }
}

export async function changeStatus(req, res, next) {
    try {
        const projectId = getNumParam(req, 'projectId', 'project');
        const taskId = getNumParam(req, 'taskId', 'task', 'id');
        if (projectId === null || taskId === null) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos' });
        }

        const project = authorizeProjectAccess(req, res, projectId);
        if (!project) return;

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'El estado es requerido.' });
        }

        const task = tasks[taskIndex];
        task.status = normalizeStatus(status);
        task.updatedAt = new Date().toISOString();

        return res.status(200).json(task);
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

export const __users = MEM.users;
export const __projects = MEM.projects;
export const __tasks = MEM.tasks;
