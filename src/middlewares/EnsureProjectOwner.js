/* migrated from app/Http/Middleware/EnsureProjectOwner.php */
export function EnsureProjectOwner(req, res, next) {
  const projectId = req.params.project; // TODO: Asegurar que req.params.project esté disponible
  
  // TODO: Reemplazar con la lógica real de obtención del proyecto desde la base de datos
  const project = {
    id: projectId,
    user_id: 1 // TODO: Obtener user_id del proyecto desde la BD
  };

  // TODO: Reemplazar con la lógica real de obtención del usuario
  const user = req.user; // TODO: Asegurar que req.user esté disponible (middleware de autenticación)

  if (project.user_id !== user.id) {
    return res.status(403).json({ error: "No autorizado." });
  }

  req.project = project; // Agregar el proyecto al request
  return next();
}

export default { EnsureProjectOwner };