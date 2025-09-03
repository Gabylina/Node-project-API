// src/controllers/Task/index.js

// In-memory mocks
const users = [];
const projects = [];
const tasks = [];

let userIdCounter = 1;
let projectIdCounter = 1;
let taskIdCounter = 1;

// Mock data creation (for initial state, controller logic operates on these dynamically)
if (users.length === 0) {
    users.push({ id: userIdCounter++, name: 'Admin User', email: 'admin@example.com', password: 'password123' });
    users.push({ id: userIdCounter++, name: 'Standard User', email: 'user@example.com', password: 'password123' });
}

if (projects.length === 0) {
    projects.push({ id: projectIdCounter++, name: 'First Project (Admin)', userId: users[0].id });
    projects.push({ id: projectIdCounter++, name: 'Second Project (Standard)', userId: users[1].id });
}

if (tasks.length === 0) {
    tasks.push({
        id: taskIdCounter++,
        projectId: projects[0].id,
        userId: projects[0].userId,
        title: 'Initial Setup',
        description: 'Configure server and database.',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    tasks.push({
        id: taskIdCounter++,
        projectId: projects[0].id,
        userId: projects[0].userId,
        title: 'Develop User Module',
        description: 'Implement user registration and login.',
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    tasks.push({
        id: taskIdCounter++,
        projectId: projects[1].id,
        userId: projects[1].userId,
        title: 'Marketing Plan',
        description: 'Outline strategy for product launch.',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
}

// Enum for Task Status
const TaskStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    BLOCKED: 'blocked'
};
const ALL_TASK_STATUSES = Object.values(TaskStatus);

// Helper to get route parameters with aliases
const getParam = (req, ...keys) => {
    for (const key of keys) {
        if (req.params?.[key] !== undefined) {
            return req.params[key];
        }
    }
    return undefined;
};

// Internal authorization helper function
const authorizeOwner = (req, resource) => {
    if (!req.user) {
        const error = new Error('No autenticado');
        error.status = 401;
        throw error;
    }
    if (req.user.id !== resource.userId) {
        const error = new Error('No autorizado.');
        error.status = 403;
        throw error;
    }
};

export async function index(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
        if (isNaN(projectId)) {
            const error = new Error('ID de proyecto no válido.');
            error.status = 400;
            throw error;
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            const error = new Error('Proyecto no encontrado.');
            error.status = 404;
            throw error;
        }

        authorizeOwner(req, project);

        const projectTasks = tasks.filter(task => task.projectId === projectId);
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

        const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
        if (isNaN(projectId)) {
            const error = new Error('ID de proyecto no válido.');
            error.status = 400;
            throw error;
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            const error = new Error('Proyecto no encontrado.');
            error.status = 404;
            throw error;
        }

        authorizeOwner(req, project);

        const { title, description } = req.body;
        if (!title) {
            const error = new Error('El título de la tarea es requerido.');
            error.status = 400;
            throw error;
        }

        const newTask = {
            id: taskIdCounter++,
            projectId: projectId,
            userId: req.user.id, // Task belongs to the user who owns the project
            title: title,
            description: description || null,
            status: TaskStatus.PENDING, // Default status
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

        const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
        const taskId = parseInt(getParam(req, 'task', 'taskId', 'id'), 10);

        if (isNaN(projectId) || isNaN(taskId)) {
            const error = new Error('ID de proyecto o tarea no válido.');
            error.status = 400;
            throw error;
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            const error = new Error('Proyecto no encontrado.');
            error.status = 404;
            throw error;
        }

        authorizeOwner(req, project);

        const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
        if (!task) {
            const error = new Error('Tarea no encontrada en este proyecto.');
            error.status = 404;
            throw error;
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

        const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
        const taskId = parseInt(getParam(req, 'task', 'taskId', 'id'), 10);

        if (isNaN(projectId) || isNaN(taskId)) {
            const error = new Error('ID de proyecto o tarea no válido.');
            error.status = 400;
            throw error;
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            const error = new Error('Proyecto no encontrado.');
            error.status = 404;
            throw error;
        }

        authorizeOwner(req, project);

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            const error = new Error('Tarea no encontrada en este proyecto.');
            error.status = 404;
            throw error;
        }

        const task = tasks[taskIndex];
        const { title, description, status } = req.body;

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) {
            if (!ALL_TASK_STATUSES.includes(status)) {
                const error = new Error(`Estado inválido. Valores permitidos: ${ALL_TASK_STATUSES.join(', ')}`);
                error.status = 400;
                throw error;
            }
            task.status = status;
        }
        task.updatedAt = new Date().toISOString();

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

        const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
        const taskId = parseInt(getParam(req, 'task', 'taskId', 'id'), 10);

        if (isNaN(projectId) || isNaN(taskId)) {
            const error = new Error('ID de proyecto o tarea no válido.');
            error.status = 400;
            throw error;
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            const error = new Error('Proyecto no encontrado.');
            error.status = 404;
            throw error;
        }

        authorizeOwner(req, project);

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            const error = new Error('Tarea no encontrada en este proyecto.');
            error.status = 404;
            throw error;
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

        const projectId = parseInt(getParam(req, 'project', 'projectId', 'id'), 10);
        const taskId = parseInt(getParam(req, 'task', 'taskId', 'id'), 10);

        if (isNaN(projectId) || isNaN(taskId)) {
            const error = new Error('ID de proyecto o tarea no válido.');
            error.status = 400;
            throw error;
        }

        const { status } = req.body;
        if (!status) {
            const error = new Error('El estado es requerido.');
            error.status = 400;
            throw error;
        }
        if (!ALL_TASK_STATUSES.includes(status)) {
            const error = new Error(`Estado inválido. Valores permitidos: ${ALL_TASK_STATUSES.join(', ')}`);
            error.status = 400;
            throw error;
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            const error = new Error('Proyecto no encontrado.');
            error.status = 404;
            throw error;
        }

        authorizeOwner(req, project);

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            const error = new Error('Tarea no encontrada en este proyecto.');
            error.status = 404;
            throw error;
        }

        const task = tasks[taskIndex];
        task.status = status;
        task.updatedAt = new Date().toISOString();

        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

// Grouped export for convenience
const TaskController = {
    index,
    store,
    show,
    update,
    destroy,
    changeStatus,
};

export default TaskController;

// Export in-memory mocks and enum for other controllers or testing purposes
export const __users = users;
export const __projects = projects;
export const __tasks = tasks;
export const __TaskStatus = TaskStatus;
