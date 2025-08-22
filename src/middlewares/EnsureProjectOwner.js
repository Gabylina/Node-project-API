/* migrated from app/Http/Middleware/EnsureProjectOwner.php */
export function EnsureProjectOwner(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const projectId = req.params.project; // TODO: Implementar obtención de projectId de req.params

  // TODO: Implementar obtención del proyecto de la base de datos
  // const project = await Project.findById(projectId);
  const project = { user_id: 0 }; // TODO: Reemplazar con la lógica real

  if (!project) {
    return res.status(404).json({ error: 'Proyecto no encontrado' });
  }

  if (project.user_id !== req.user.id) { // TODO: req.user debe ser poblado por un middleware de autenticación
    return res.status(403).json({ error: 'No autorizado.' });
  }

  req.project = project; // Agregar el proyecto al request
  return next();
}

export default { EnsureProjectOwner };