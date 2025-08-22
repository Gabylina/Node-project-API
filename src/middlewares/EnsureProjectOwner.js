/* migrated from app/Http/Middleware/EnsureProjectOwner.php */
export function EnsureProjectOwner(req, res, next) {
  const projectId = req.params.project; // TODO: Asegurarse que req.params.project esté disponible

  // TODO: Reemplazar con la lógica real para obtener el proyecto desde la base de datos
  const project = {
    id: projectId,
    user_id: 0 // TODO: Obtener userId desde la base de datos
  };

  // TODO: Poblar req.user en un middleware de autenticación previo
  if (project.user_id !== req.user.id) {
    return return res.status(403).json({ error: "No autorizado." });
  }

  req.project = project; // Añadimos el proyecto al request
  return next();
}

export default { EnsureProjectOwner };