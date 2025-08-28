/* migrated from database/seeders/DatabaseSeeder.php */

// TODO: Import TaskStatus enum or ensure it's provided via deps.
// Example:
// import { TaskStatus } from '../../app/enums/TaskStatus.js';

/**
 * Seeds the database with initial data.
 * @param {object} deps - Injected dependencies (repositories, hasher, enums, etc.).
 * @param {object} deps.userRepository - Repository for User model operations.
 * @param {object} deps.projectRepository - Repository for Project model operations.
 * @param {object} deps.taskRepository - Repository for Task model operations.
 * @param {object} deps.hasher - Service for hashing passwords (e.g., bcrypt).
 * @param {object} [deps.TaskStatus] - Enum for task statuses (PENDING, IN_PROGRESS, etc.).
 */
export async function seed(deps = {}) {
  // TODO: Add logging if necessary, e.g., deps.logger.info('Seeding Database...');

  const { userRepository, projectRepository, taskRepository, hasher } = deps;

  if (!userRepository || !projectRepository || !taskRepository || !hasher) {
    throw new Error('Missing required dependencies for DatabaseSeeder: userRepository, projectRepository, taskRepository, hasher');
  }

  // Ensure TaskStatus enum is available, either imported or via deps.
  // If `deps.TaskStatus` is not provided, you might need to import it directly.
  // Example of direct import (uncomment and adjust path if used):
  // const TaskStatus = deps.TaskStatus || (await import('../../app/enums/TaskStatus.js')).TaskStatus;
  // For now, we'll assume it's directly available via deps or globally.
  const TaskStatus = deps.TaskStatus || { PENDING: 'pending', IN_PROGRESS: 'in_progress' }; // Fallback or direct import needed

  // User::firstOrCreate(
  //     ['email' => 'demo@example.com'],
  //     ['name' => 'Demo', 'password' => Hash::make('password')]
  // );
  let user = await userRepository.findByEmail('demo@example.com');
  if (!user) {
    const hashedPassword = await hasher.make('password');
    user = await userRepository.create({
      name: 'Demo',
      email: 'demo@example.com',
      password: hashedPassword,
    });
  }

  // Project::create([
  //     'user_id' => $user->id,
  //     'name' => 'Proyecto Demo',
  //     'description' => 'Proyecto inicial con tareas',
  // ]);
  const project = await projectRepository.create({
    userId: user.id,
    name: 'Proyecto Demo',
    description: 'Proyecto inicial con tareas',
  });

  // Task::create([
  //     'project_id' => $project->id,
  //     'title' => 'Investigar requerimientos',
  //     'status' => TaskStatus::PENDING,
  // ]);
  await taskRepository.create({
    projectId: project.id,
    title: 'Investigar requerimientos',
    status: TaskStatus.PENDING,
  });

  // Task::create([
  //     'project_id' => $project->id,
  //     'title' => 'Configurar entorno',
  //     'status' => TaskStatus::IN_PROGRESS,
  // ]);
  await taskRepository.create({
    projectId: project.id,
    title: 'Configurar entorno',
    status: TaskStatus.IN_PROGRESS,
  });

  // TODO: Add logging for completion, e.g., deps.logger.info('Database seeded successfully.');
}

export default { seed };
