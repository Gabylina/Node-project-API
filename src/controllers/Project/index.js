/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

// TODO: Import services/models
// import { ProjectService } from '../../services/ProjectService.js';
// import { Project } from '../../models/Project.js';

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function index(req, res, next) {
  try {
    // TODO: Implement service call
    // const projects = await ProjectService.listFor(req.user);
    // return res.status(200).json(projects);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function store(req, res, next) {
  try {
    // TODO: Implement service call
    // const project = await ProjectService.createFor(req.user, req.body);
    // return res.status(201).json(project);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */\export async function show(req, res, next) {
  try {
    // TODO: Implement model retrieval and authorization
    // const project = await Project.with('tasks').findOrFail(req.params.id);
    // if (req.user?.id !== project.user_id) {
    //   return res.sendStatus(403);
    // }
    // return res.status(200).json(project);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function update(req, res, next) {
  try {
    // TODO: Implement model retrieval, authorization and service call
    // const project = await Project.findOrFail(req.params.id);
    // if (req.user?.id !== project.user_id) {
    //   return res.sendStatus(403);
    // }
    // const updatedProject = await ProjectService.update(project, req.body);
    // return res.status(200).json(updatedProject);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function destroy(req, res, next) {
  try {
    // TODO: Implement model retrieval, authorization and deletion
    // const project = await Project.findOrFail(req.params.id);
    // if (req.user?.id !== project.user_id) {
    //   return res.sendStatus(403);
    // }
    // await project.delete();
    // return res.sendStatus(204);
    return res.status(200).json({ ok: true });
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
