const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;
const projects = MEM.projects;
const tasks = MEM.tasks;

const getParam = (req, ...keys) => {
  const paramKey = keys.find(key => req.params?.[key] !== undefined);
  return paramKey ? Number(req.params[paramKey]) : undefined;
};

async function authorizeOwner(req, res, next, project) {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  if (project.userId !== req.user.id) {
    return res.status(403).json({ message: 'No autorizado' });
  }
  return true;
}

export async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const userProjects = projects.filter(p => p.userId === req.user.id);
    return res.status(200).json(userProjects);
  } catch (e) {
    return next(e);
  }
}

export async function store(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'El nombre del proyecto es requerido.' });
    }

    const now = new Date().toISOString();
    const newProject = {
      id: MEM.seq.project++,
      name,
      description: description ?? null,
      userId: req.user.id,
      createdAt: now,
      updatedAt: now,
    };
    projects.push(newProject);
    return res.status(201).json(newProject);
  } catch (e) {
    return next(e);
  }
}

export async function show(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!(await authorizeOwner(req, res, next, project))) return;

    const projectTasks = tasks.filter(t => t.projectId === projectId);
    return res.status(200).json({ ...project, tasks: projectTasks });
  } catch (e) {
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }
    const project = projects[projectIndex];

    if (!(await authorizeOwner(req, res, next, project))) return;

    const { name, description } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    project.updatedAt = new Date().toISOString();

    return res.status(200).json(project);
  } catch (e) {
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    const projectId = getParam(req, 'project', 'projectId', 'id');
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }
    const project = projects[projectIndex];

    if (!(await authorizeOwner(req, res, next, project))) return;

    // Remove project
    projects.splice(projectIndex, 1);

    // Remove associated tasks (in-place)
    for (let i = tasks.length - 1; i >= 0; i--) {
      if (tasks[i].projectId === projectId) {
        tasks.splice(i, 1);
      }
    }

    return res.status(204).json({});
  } catch (e) {
    return next(e);
  }
}

export const __users = MEM.users;
export const __projects = MEM.projects;
export const __tasks = MEM.tasks;

export default {
  index,
  store,
  show,
  update,
  destroy,
};
