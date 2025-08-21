import { ProjectService } from '../../services/ProjectService.js';
const service = new ProjectService();
export async function index(req, res, next) {
  try {
    const data = await service.listFor(req.user);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}
export async function store(req, res, next) {
  try {
    const project = await service.createFor(req.user, req.body);
    return res.status(201).json(project);
  } catch (err) {
    return next(err);
  }
}
export async function show(req, res, next) {
  try {
    const project = await Project.with('tasks').findOrFail(req.params.id);
    if (req.user?.id !== project.user_id) {
      return res.sendStatus(403);
    }
    return res.status(200).json(project);
  } catch (err) {
    return next(err);
  }
}
export async function update(req, res, next) {
  try {
    const project = await Project.findOrFail(req.params.id);
    if (req.user?.id !== project.user_id) {
      return res.sendStatus(403);
    }
    const updated = await service.update(project, req.body);
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
}
export async function destroy(req, res, next) {
  try {
    const project = await Project.findOrFail(req.params.id);
    if (req.user?.id !== project.user_id) {
      return res.sendStatus(403);
    }
    await project.delete();
    return res.sendStatus(204);
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
};
