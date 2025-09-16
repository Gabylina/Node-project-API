/* migrated from app/Http/Requests/Project/UpdateProjectRequest.php */

export function UpdateProjectRequest(req, res, next) {
    const errors = [];
    const body = req.body;

    // Validate 'name'
    // Rules: ['sometimes', 'string', 'max:255']
    if (Object.prototype.hasOwnProperty.call(body, 'name')) {
        const name = body.name;
        if (typeof name !== 'string') {
            errors.push({ field: 'name', message: 'The name must be a string.' });
        } else if (name.length > 255) {
            errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
        }
    }

    // Validate 'description'
    // Rules: ['sometimes', 'nullable', 'string']
    if (Object.prototype.hasOwnProperty.call(body, 'description')) {
        const description = body.description;
        // If description is not null, it must be a string.
        if (description !== null && typeof description !== 'string') {
            errors.push({ field: 'description', message: 'The description must be a string or null.' });
        }
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default { UpdateProjectRequest };