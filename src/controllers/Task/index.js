const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;
const projects = MEM.projects;
const tasks = MEM.tasks;

const getParam = (req, ...keys) => {
    for (const key of keys) {
        const val = req?.params?.[key];
        if (val !== undefined) return Number(val);
    }
    return NaN;
};

const normalizeStatus = s => {
    const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
    return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

export async function index(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const projectId = getParam(req, 'project', 'projectId', 'id');
        if (isNaN(projectId)) {
            return res.status(400).json({ message: 'ID de proyecto inválido' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        if (project.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado para acceder a este proyecto' });
        }

        const projectTasks = tasks.filter(t => t.projectId === projectId);
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
        if (isNaN(projectId)) {
            return res.status(400).json({ message: 'ID de proyecto inválido' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        if (project.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado para crear tareas en este proyecto' });
        }

        const { name, description, status } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'El nombre de la tarea es requerido' });
        }

        const newTask = {
            id: MEM.seq.task++,
            name,
            description: description ?? null,
            status: normalizeStatus(status ?? 'pending'),
            projectId: projectId,
            userId: req.user.id,
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
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const projectId = getParam(req, 'project', 'projectId', 'id');
        const taskId = getParam(req, 'task', 'taskId', 'id');

        if (isNaN(projectId) || isNaN(taskId)) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        if (project.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado para acceder a este proyecto' });
        }

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
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const projectId = getParam(req, 'project', 'projectId', 'id');
        const taskId = getParam(req, 'task', 'taskId', 'id');

        if (isNaN(projectId) || isNaN(taskId)) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        if (project.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado para modificar tareas en este proyecto' });
        }

        const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        const { name, description, status } = req.body;
        let changed = false;

        if (name !== undefined) {
            task.name = name;
            changed = true;
        }
        if (description !== undefined) {
            task.description = description;
            changed = true;
        }
        if (status !== undefined) {
            const newStatus = normalizeStatus(status);
            if (task.status !== newStatus) {
                task.status = newStatus;
                changed = true;
            }
        }

        if (changed) {
            task.updatedAt = new Date().toISOString();
        }

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

        if (isNaN(projectId) || isNaN(taskId)) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        if (project.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado para eliminar tareas en este proyecto' });
        }

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        tasks.splice(taskIndex, 1);
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

        if (isNaN(projectId) || isNaN(taskId)) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        if (project.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado para cambiar el estado de tareas en este proyecto' });
        }

        const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'El estado es requerido' });
        }

        const newStatus = normalizeStatus(status);

        if (task.status !== newStatus) {
            task.status = newStatus;
            task.updatedAt = new Date().toISOString();
        }

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
