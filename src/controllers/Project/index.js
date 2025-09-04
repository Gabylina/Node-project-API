const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], seq: { user: 1, project: 1, task: 1 } });
const projects = MEM.projects;
const tasks = MEM.tasks;

const getProjectId = (req) => {
  const projectId = Number(req.params?.project ?? req.params?.projectId ?? req.params?.id);
  return isNaN(projectId) ? null : projectId;
};

const authorizeOwner = (req, res, project) => {
  if (!req.user) {
    res.status(401).json({ message: 'No autenticado' });
    return false;
  }
  if (project.userId !== req.user.id) {
    res.status(403).json({ message: 'No autorizado' });
    return false;
  }
  return true;
};

export async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const userProjects = projects.filter(p => p.userId === req.user.id);
    return res.status(200).json(userProjects);
  } catch (e) {
    next(e);
  }
}

export async function store(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'El nombre del proyecto es requerido.' });
    }

    const newProject = {
      id: MEM.seq.project++,
      userId: req.user.id,
      name: name.trim(),
      description: description ? String(description).trim() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    return res.status(201).json(newProject);
  } catch (e) {
    next(e);
  }
}

export async function show(req, res, next) {
  try {
    const projectId = getProjectId(req);
    if (projectId === null) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeOwner(req, res, project)) {
      return; 
    }

    const projectTasks = tasks.filter(t => t.projectId === projectId);
    return res.status(200).json({ ...project, tasks: projectTasks });
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const projectId = getProjectId(req);
    if (projectId === null) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    let project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    if (!authorizeOwner(req, res, project)) {
      return;
    }

    const { name, description } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'El nombre del proyecto no puede estar vacío.' });
      }
      project.name = name.trim();
    }
    if (description !== undefined) {
      project.description = description ? String(description).trim() : null;
    }

    project.updatedAt = new Date().toISOString();

    return res.status(200).json(project);
  } catch (e) {
    next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    const projectId = getProjectId(req);
    if (projectId === null) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    const project = projects[projectIndex];
    if (!authorizeOwner(req, res, project)) {
      return;
    }

    MEM.tasks = tasks.filter(t => t.projectId !== projectId);
    projects.splice(projectIndex, 1);

    return res.status(204).json({});
  } catch (e) {
    next(e);
  }
}

const ProjectController = {
  index,
  store,
  show,
  update,
  destroy,
};

export default ProjectController;

export const __projects = MEM.projects;
export const __tasks = MEM.tasks;
