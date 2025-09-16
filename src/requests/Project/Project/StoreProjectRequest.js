/* migrated from app/Http/Requests/Project/StoreProjectRequest.php */

export function StoreProjectRequest(req, res, next) {
  const errors = [];
  const data = req.body; // Assuming validation for Store requests applies to req.body

  // Validate 'name'
  const name = data.name;
  if (name === undefined || name === null || (typeof name === 'string' && name.trim() === '')) {
    errors.push({ field: 'name', message: 'The name field is required.' });
  } else {
    if (typeof name !== 'string') {
      errors.push({ field: 'name', message: 'The name must be a string.' });
    } else if (name.length > 255) {
      errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
    }
  }

  // Validate 'description'
  const description = data.description;
  // 'nullable' rule: if description is undefined or null, it's valid. 
  // Only apply 'string' validation if it's present and not null.
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'The description must be a string.' });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default {
  StoreProjectRequest
};
