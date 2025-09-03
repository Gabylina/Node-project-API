const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });
const projects = MEM.projects;
const tasks = MEM.tasks;

const getProjectId = (req) => Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);

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

    const newProject = {
      id: MEM.seq.project++,
      name,
      description: description ?? null,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);
    return res.status(201).json(newProject);
  } catch (e) {
    return next(e);
  }
}

export async function show(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getProjectId(req);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const projectTasks = tasks.filter(t => t.projectId === projectId);
    return res.status(200).json({ ...project, tasks: projectTasks });
  } catch (e) {
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getProjectId(req);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    const project = projects[projectIndex];
    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    const { name, description } = req.body;

    if (name !== undefined) {
      project.name = name;
    }
    if (description !== undefined) {
      project.description = description;
    }
    project.updatedAt = new Date().toISOString();

    // projects[projectIndex] = project; // No need to reassign for object mutation
    return res.status(200).json(project);
  } catch (e) {
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = getProjectId(req);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    const project = projects[projectIndex];
    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    // Remove project
    projects.splice(projectIndex, 1);

    // Cascade delete tasks
    MEM.tasks = tasks.filter(t => t.projectId !== projectId);

    return res.status(204).json({});
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
};

export const __projects = MEM.projects;
export const __tasks = MEM.tasks;