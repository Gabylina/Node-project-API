import { Project, Task } from '../../models/index.js';
import { TaskService } from '../../services/index.js';

const service = new TaskService();

export async function index(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.sendStatus(404);
    // TODO: this.authorizeOwner(project);
    const tasks = await service.list(project);
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
}

export async function store(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.sendStatus(404);
    // TODO: this.authorizeOwner(project);
    const task = await service.create(project, req.body);
    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
}

export async function show(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.sendStatus(404);
    // TODO: this.authorizeOwner(project);
    const task = await Task.findOne({ where: { project_id: req.params.projectId, id: req.params.taskId } });
    if (!task) return res.sendStatus(404);
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.sendStatus(404);
    // TODO: this.authorizeOwner(project);
    const task = await Task.findOne({ where: { project_id: req.params.projectId, id: req.params.taskId } });
    if (!task) return res.sendStatus(404);
    const updated = await service.update(task, req.body);
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.sendStatus(404);
    // TODO: this.authorizeOwner(project);
    const task = await Task.findOne({ where: { project_id: req.params.projectId, id: req.params.taskId } });
    if (!task) return res.sendStatus(404);
    await task.destroy();
    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
}

export async function changeStatus(req, res, next) {
  try {
    const { status } = req.body;

    //Validación básica (Mejorar con un validador externo)
    const allowedStatuses = [/*TODO: Obtener valores de TaskStatus*/];
    if (!allowedStatuses.includes(status)) {
      return res.sendStatus(422);
    }

    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.sendStatus(404);
    // TODO: this.authorizeOwner(project);
    const task = await Task.findOne({ where: { project_id: req.params.projectId, id: req.params.taskId } });
    if (!task) return res.sendStatus(404);
    const updated = await service.update(task, { status });
    return res.status(200).json(updated);
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