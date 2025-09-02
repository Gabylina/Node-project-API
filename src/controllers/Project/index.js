// Project controller for Express
const getParam = (req, ...keys) => keys.map(k=>req?.params?.[k]).find(v=>v!==undefined);

export async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    // Mocking the service call to list projects for the authenticated user
    const mockProjects = [
      { id: 'proj1', name: 'Mock Project 1', userId: req.user.id },
      { id: 'proj2', name: 'Mock Project 2', userId: 'another-user-id' }
    ];
    const userProjects = mockProjects.filter(p => p.userId === req.user.id);
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
    // Mocking project creation with validated data from request body
    const newProject = {
      id: `proj-${Date.now()}`, // Simple mock ID
      name: req.body?.name || 'New Mock Project',
      description: req.body?.description || '',
      userId: req.user.id,
      ...req.body,
    };
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

    const projectId = getParam(req, 'project', 'projectId', 'id');
    if (!projectId) {
        return res.status(400).json({ message: 'ID de proyecto no proporcionado' });
    }

    // Mocking finding project by ID and including tasks
    const mockProject = {
      id: projectId,
      name: `Mock Project ${projectId}`,
      description: `Description for ${projectId}`,
      user_id: req.user.id, // Assume project belongs to current user for auth mock
      tasks: [
        { id: 'task1', name: 'Task 1', projectId: projectId },
        { id: 'task2', name: 'Task 2', projectId: projectId },
      ],
    };

    // Authorization check (equivalent to authorizeOwner)
    if (req.user.id !== mockProject.user_id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    return res.status(200).json(mockProject);
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
    if (!projectId) {
        return res.status(400).json({ message: 'ID de proyecto no proporcionado' });
    }

    // Mocking finding project by ID
    const mockProject = {
      id: projectId,
      name: `Existing Mock Project ${projectId}`,
      description: `Existing description for ${projectId}`,
      user_id: req.user.id, // Assume project belongs to current user for auth mock
    };

    // Authorization check (equivalent to authorizeOwner)
    if (req.user.id !== mockProject.user_id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Mocking project update with validated data from request body
    const updatedProject = { ...mockProject, ...req.body };
    return res.status(200).json(updatedProject);
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
    if (!projectId) {
        return res.status(400).json({ message: 'ID de proyecto no proporcionado' });
    }

    // Mocking finding project by ID
    const mockProject = {
      id: projectId,
      name: `Project to delete ${projectId}`,
      user_id: req.user.id, // Assume project belongs to current user for auth mock
    };

    // Authorization check (equivalent to authorizeOwner)
    if (req.user.id !== mockProject.user_id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Mocking project deletion
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
