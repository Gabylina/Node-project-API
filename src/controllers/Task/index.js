import { AppError } from '../../utils/AppError.js'; // Example for custom error handling

// TODO: Import necessary services and models
// import * as ProjectService from '../../services/ProjectService.js';
// import * as TaskService from '../../services/TaskService.js';
// import { TaskStatus } from '../../enums/TaskStatus.js'; // Example for shared enums

// Placeholder/mock for demonstration. In a real app, these would be actual service/model calls.
// You would replace `Project.findOrFail` and `Task.where(...).findOrFail` with calls to your
// database layer (e.g., an ORM like Prisma, Sequelize, or custom data access functions).
const Project = {
    async findOrFail(id) {
        // Example: If project not found, throw an error with status 404
        const project = /* await ProjectService.getById(id) */; // TODO: Replace with actual service call
        if (!project) throw new AppError('Project not found', 404);
        return project; // Mock project data
    }
};
const Task = {
    async where(projectIdKey, projectIdValue) {
        return {
            async findOrFail(taskId) {
                // Example: If task not found within project, throw an error with status 404
                const task = /* await TaskService.getByIdAndProject(taskId, projectIdValue) */; // TODO: Replace
                if (!task) throw new AppError('Task not found', 404);
                return task; // Mock task data
            }
        };
    }
};
const TaskService = { // TODO: Replace with actual TaskService imports/instantiation
    async list(project) { return [{ id: 101, project_id: project.id, name: 'Task 1' }]; },
    async create(project, data) { return { ...data, id: Math.random(), project_id: project.id }; },
    async update(task, data) { return { ...task, ...data }; },
    async delete(task) { return true; }
};

// TODO: Define or import TaskStatus enum from a shared location
// This is used for validation of the 'status' field.
const TaskStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    values: ['pending', 'in_progress', 'completed'], // For validation checks
};

/**
 * Helper function to authorize project ownership.
 * In Express, this logic is often placed in a dedicated middleware or a utility function.
 * Assumes `req.user` is populated by an authentication middleware with the authenticated user's ID.
 */
const authorizeOwner = (req, project) => {
    // Assuming req.user = { id: 100, name: 'john.doe' } from an authentication middleware
    if (!req.user || req.user.id !== project.user_id) {
        // Throw an AppError (or a standard Error) which will be caught by the try-catch
        // and passed to `next(err)` for global error handling.
        throw new AppError('No autorizado.', 403);
    }
};

export async function index(req, res, next) {
    try {
        const { projectId } = req.params;
        // `req.params` values are strings, convert to number for database queries.
        const project = await Project.findOrFail(parseInt(projectId, 10));
        authorizeOwner(req, project);

        // TODO: Call TaskService.list(project) for actual task listing
        const tasks = await TaskService.list(project); // Placeholder for service call
        return res.status(200).json(tasks);
    } catch (err) {
        return next(err);
    }
}

export async function store(req, res, next) {
    try {
        const { projectId } = req.params;
        // TODO: Implement request body validation (e.g., using Joi, Zod, or a validation middleware).
        // `req.body` directly corresponds to `$request->validated()` after validation.
        // const validatedData = req.body; 

        const project = await Project.findOrFail(parseInt(projectId, 10));
        authorizeOwner(req, project);

        // TODO: Call TaskService.create(project, req.body)
        const task = await TaskService.create(project, req.body); // Placeholder for service call
        return res.status(201).json(task);
    } catch (err) {
        return next(err);
    }
}

export async function show(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        const project = await Project.findOrFail(parseInt(projectId, 10));
        authorizeOwner(req, project);

        // TODO: Call TaskService.getByIdAndProject(taskId, projectId)
        const task = await Task.where('project_id', parseInt(projectId, 10)).findOrFail(parseInt(taskId, 10)); // Placeholder for service call
        return res.status(200).json(task);
    } catch (err) {
        return next(err);
    }
}

export async function update(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        // TODO: Implement request body validation.
        // const validatedData = req.body;

        const project = await Project.findOrFail(parseInt(projectId, 10));
        authorizeOwner(req, project);

        // TODO: Call TaskService.getByIdAndProject to fetch the existing task
        const task = await Task.where('project_id', parseInt(projectId, 10)).findOrFail(parseInt(taskId, 10)); // Placeholder for service call
        
        // TODO: Call TaskService.update(task, req.body)
        const updatedTask = await TaskService.update(task, req.body); // Placeholder for service call
        return res.status(200).json(updatedTask);
    } catch (err) {
        return next(err);
    }
}

export async function destroy(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        const project = await Project.findOrFail(parseInt(projectId, 10));
        authorizeOwner(req, project);

        // TODO: Call TaskService.getByIdAndProject to fetch the existing task
        const task = await Task.where('project_id', parseInt(projectId, 10)).findOrFail(parseInt(taskId, 10)); // Placeholder for service call
        
        // TODO: Call TaskService.delete(task)
        await TaskService.delete(task); // Placeholder for service call
        return res.sendStatus(204); // Responds with 204 No Content
    } catch (err) {
        return next(err);
    }
}

export async function changeStatus(req, res, next) {
    try {
        const { projectId, taskId } = req.params;
        const { status } = req.body; // `$request->input('status')` maps to `req.body.status`

        // TODO: Implement validation for 'status' field. Example below:
        if (!status || !TaskStatus.values.includes(status)) {
            throw new AppError(
                `Invalid status value. Must be one of: ${TaskStatus.values.join(', ')}`,
                422 // HTTP 422 Unprocessable Entity
            );
        }

        const project = await Project.findOrFail(parseInt(projectId, 10));
        authorizeOwner(req, project);

        // TODO: Call TaskService.getByIdAndProject to fetch the existing task
        const task = await Task.where('project_id', parseInt(projectId, 10)).findOrFail(parseInt(taskId, 10)); // Placeholder for service call
        
        // TODO: Call TaskService.update(task, { status: status })
        const updatedTask = await TaskService.update(task, { status }); // Placeholder for service call
        return res.status(200).json(updatedTask);
    } catch (err) {
        return next(err);
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
