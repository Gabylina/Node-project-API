/* migrated from database/seeders/DatabaseSeeder.php */

import TaskStatus from '../../enums/TaskStatus.js';

// TODO: Import necessary repositories/factories for your models (User, Project, Task).
// Example:
// import { userRepo } from '../repositories/UserRepository.js';
// import { projectRepo } from '../repositories/ProjectRepository.js';
// import { taskRepo } from '../repositories/TaskRepository.js';
// TODO: Import your TaskStatus enum.
// Example:
// import { TaskStatus } from '../enums/TaskStatus.js';
// TODO: Import a password hashing utility if needed.
// Example:
// import { hasher } from '../utils/hasher.js';

/**
 * Seeds the database with initial data.
 * @param {object} deps - Dependencies like repositories, factories, enums, etc.
 * @param {object} deps.userRepo - Repository for User model operations.
 * @param {object} deps.projectRepo - Repository for Project model operations.
 * @param {object} deps.taskRepo - Repository for Task model operations.
 * @param {object} deps.TaskStatus - Enum for task statuses (e.g., PENDING, IN_PROGRESS).
 * @param {object} [deps.hasher] - Utility for password hashing (e.g., `bcrypt`).
 * @param {object} [deps.logger] - Optional logger instance.
 */
export async function seed(deps = {}) {
  const { userRepo, projectRepo, taskRepo, hasher, logger = console } = deps;
// --- Dependency validation ---
  if (!userRepo) {
    logger.error('DatabaseSeeder: userRepo dependency is missing.');
    throw new Error('DatabaseSeeder: userRepo dependency is missing.');
  }
  if (!projectRepo) {
    logger.error('DatabaseSeeder: projectRepo dependency is missing.');
    throw new Error('DatabaseSeeder: projectRepo dependency is missing.');
  }
  if (!taskRepo) {
    logger.error('DatabaseSeeder: taskRepo dependency is missing.');
    throw new Error('DatabaseSeeder: taskRepo dependency is missing.');
  }
  if (!TaskStatus) {
    logger.error('DatabaseSeeder: TaskStatus enum dependency is missing.');
    throw new Error('DatabaseSeeder: TaskStatus enum dependency is missing.');
  }
  // Optional hasher check, if password hashing is critical and always required.
  // if (!hasher) {
  //   logger.warn('DatabaseSeeder: hasher dependency is missing. Passwords might be stored unhashed.');
  // }
  // -----------------------------

  logger.log('Seeding initial database data...');

  const hashedPassword = hasher ? await hasher.make('password') : 'password'; // TODO: Implement actual hashing or ensure repo handles it.

  const user = await userRepo.firstOrCreate(
    { email: 'demo@example.com' },
    { name: 'Demo', password: hashedPassword }
  ); // TODO: Ensure your userRepo has a firstOrCreate method.

  if (!user) {
    logger.error('Failed to create or find demo user.');
    throw new Error('Failed to create or find demo user.');
  }
  logger.log(`Demo user created/found: ${user.email}`);

  const project = await projectRepo.create({
    user_id: user.id, // Assuming the user object returned has an 'id' property
    name: 'Proyecto Demo',
    description: 'Proyecto inicial con tareas',
  }); // TODO: Ensure your projectRepo has a create method.

  if (!project) {
    logger.error('Failed to create demo project.');
    throw new Error('Failed to create demo project.');
  }
  logger.log(`Demo project created: ${project.name}`);

  await taskRepo.create({
    project_id: project.id, // Assuming the project object returned has an 'id' property
    title: 'Investigar requerimientos',
    status: TaskStatus.PENDING, // Using the injected TaskStatus enum
  }); // TODO: Ensure your taskRepo has a create method.

  await taskRepo.create({
    project_id: project.id,
    title: 'Configurar entorno',
    status: TaskStatus.IN_PROGRESS, // Using the injected TaskStatus enum
  });

  logger.log('Database seeding completed successfully.');
}

export default { seed };
