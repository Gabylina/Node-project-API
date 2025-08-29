
// === n8n patch: dynamic imports with fallbacks ===
let ProjectService;
try { const m = await import('../../services/ProjectService.js'); ProjectService = m.default ?? m; }
catch {
  ProjectService = { listFor: async()=>[], createFor: async(_u,d)=>({id:'mock-project',...d}), update: async(p,d)=>({ ...p, ...d }) };
}
let ProjectModel;
try { const m = await import('../../models/Project.js'); ProjectModel = m.default ?? m; }
catch { ProjectModel = { findById: async()=>null }; }
// === end n8n patch ===


/**
 * Helper function to handle authorization for project ownership.
 * This mimics the behavior of the private `authorizeOwner` method in Laravel, 
 * throwing an error if the user is not authorized.
 * In a real Express application, this logic might be refactored into a dedicated
 * authentication/authorization middleware for better reusability and separation of concerns.
 */
const authorizeOwner = (req, project) => {
    // Assuming `req.user` is populated by an authentication middleware
    // (e.g., Passport.js, JWT middleware) and contains the authenticated user's ID.
    if (!req.user || req.user.id !== project.user_id) {
        const error = new Error('No autorizado.');
        error.statusCode = 403; // Custom property for a global error handling middleware
        throw error; // Throwing an error allows the calling function's try/catch to handle it
    }
    // If no error is thrown, the user is authorized.
};

/**
 * Lists projects for the authenticated user.
 * Equivalent to: `public function index(Request $request)`
 */
export async function index(req, res, next) {
    try {
        // Laravel: `$this->service->listFor($request->user())`
        // Assuming `ProjectService` handles the logic to fetch projects for a given user.
        const projects = await ProjectService.listFor(req.user);
        return res.status(200).json(projects);
    } catch (err) {
        return next(err);
    }
}

/**
 * Stores a new project.
 * Equivalent to: `public function store(StoreProjectRequest $request)`
 */
export async function store(req, res, next) {
    try {
        // Laravel: `$request->validated()` is assumed to be handled by a validation middleware
        // (e.g., `express-validator`, Joi) before this handler is called. `req.body` will contain the validated data.
        // Laravel: `$this->service->createFor($request->user(), $request->validated())`
        const project = await ProjectService.createFor(req.user, req.body);
        return res.status(201).json(project);
    } catch (err) {
        return next(err);
    }
}

/**
 * Displays a specific project.
 * Equivalent to: `public function show($id)`
 */
export async function show(req, res, next) {
    try {
        // Laravel: `Project::with('tasks')->findOrFail($id)`
        const projectId = req.params.id; // Map `{id}` from route to `req.params.id`
        const project = await Project.findById(projectId).populate('tasks'); // Assuming Mongoose `populate` for 'with'

        if (!project) {
            const error = new Error('Proyecto no encontrado.');
            error.statusCode = 404;
            throw error;
        }

        // Laravel: `$this->authorizeOwner($project);`
        authorizeOwner(req, project);

        return res.status(200).json(project);
    } catch (err) {
        return next(err);
    }
}

/**
 * Updates an existing project.
 * Equivalent to: `public function update(UpdateProjectRequest $request, $id)`
 */
export async function update(req, res, next) {
    try {
        // Laravel: `Project::findOrFail($id)`
        const projectId = req.params.id; // Map `{id}` from route to `req.params.id`
        let project = await Project.findById(projectId);

        if (!project) {
            const error = new Error('Proyecto no encontrado.');
            error.statusCode = 404;
            throw error;
        }

        // Laravel: `$this->authorizeOwner($project);`
        authorizeOwner(req, project);

        // Laravel: `$this->service->update($project, $request->validated())`
        const updatedProject = await ProjectService.update(project, req.body);

        return res.status(200).json(updatedProject);
    } catch (err) {
        return next(err);
    }
}

/**
 * Deletes a project.
 * Equivalent to: `public function destroy($id)`
 */
export async function destroy(req, res, next) {
    try {
        // Laravel: `Project::findOrFail($id)`
        const projectId = req.params.id; // Map `{id}` from route to `req.params.id`
        const project = await Project.findById(projectId);

        if (!project) {
            const error = new Error('Proyecto no encontrado.');
            error.statusCode = 404;
            throw error;
        }

        // Laravel: `$this->authorizeOwner($project);`
        authorizeOwner(req, project);

        // Laravel: `$project->delete();`
        await project.deleteOne(); // Or `project.remove()` depending on ORM

        // Laravel: `response()->json([], 204)`
        // Express typically sends an empty object for 204 No Content.
        return res.status(204).json({});
    } catch (err) {
        return next(err);
    }
}

// Default export for all handlers, simplifying router setup.
export default {
    index,
    store,
    show,
    update,
    destroy,
};
