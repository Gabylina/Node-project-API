/* migrated from database/seeders/DatabaseSeeder.php */

import TaskStatus from '../../enums/TaskStatus.js';

// TODO: Import concrete implementations of repositories, enums, and utilities.
// Example:
// import { UserRepository } from '../../app/repositories/UserRepository.js';
// import { ProjectRepository } from '../../app/repositories/ProjectRepository.js';
// import { TaskRepository } from '../../app/repositories/TaskRepository.js';
// import { TaskStatusEnum } from '../../app/enums/TaskStatusEnum.js'; // Ensure this enum is migrated to JS
// import { PasswordHasher } from '../../app/services/PasswordHasher.js'; // Example utility for hashing passwords

/**
 * Seeds the database with initial demo data.
 *
 * @param {object} deps - Dependencies to be injected.
 * @param {object} deps.userRepo - Repository for User model operations. Must have `findOrCreate(findAttributes, createAttributes)`.
 * @param {object} deps.projectRepo - Repository for Project model operations. Must have `create(data)`.
 * @param {object} deps.taskRepo - Repository for Task model operations. Must have `create(data)`.
 *  * @param {object} deps.hasher - Utility for hashing passwords. Must have `hash(password)`.
 * @param {object} [deps.logger] - Optional logger for outputting seed process.
 */
export async function seed(deps = {}) {
  const { userRepo, projectRepo, taskRepo, hasher, logger = console } = deps;
// --- Dependency validation (TODO: Replace with actual concrete imports in a real app) ---
  if (!userRepo || typeof userRepo.findOrCreate !== 'function') {
    logger.error('Error: userRepo (with findOrCreate method) not provided in deps.');
    // TODO: Consider a mock or throw an error based on your seeding environment strategy.
    // Example: Throwing an error to ensure explicit dependency provision.
    throw new Error('userRepo with findOrCreate method is required.');
  }

  if (!projectRepo || typeof projectRepo.create !== 'function') {
    logger.error('Error: projectRepo (with create method) not provided in deps.');
    throw new Error('projectRepo with create method is required.');
  }

  if (!taskRepo || typeof taskRepo.create !== 'function') {
    logger.error('Error: taskRepo (with create method) not provided in deps.');
    throw new Error('taskRepo with create method is required.');
  }

  if (!taskStatusEnum || typeof taskStatusEnum !== 'object' || !taskStatusEnum.PENDING || !taskStatusEnum.IN_PROGRESS) {
    logger.error('Error: taskStatusEnum (with PENDING and IN_PROGRESS values) not provided in deps or incomplete.');
    // TODO: If enum values are fixed and not dynamic, they could be hardcoded as a last resort.
    throw new Error('taskStatusEnum with PENDING and IN_PROGRESS values is required.');
  }

  if (!hasher || typeof hasher.hash !== 'function') {
    logger.error('Error: hasher (with hash method) not provided in deps.');
    throw new Error('hasher with hash method is required.');
  }
  // --- End Dependency validation ---


  // User::firstOrCreate equivalent
  const user = await userRepo.findOrCreate(
    { email: 'demo@example.com' },
    { name: 'Demo', password: await hasher.make('password') }
  );
  logger.info(`User with email '${user.email}' (ID: ${user.id}) created or found.`);

  // Project::create equivalent
  const project = await projectRepo.create({
    user_id: user.id,
    name: 'Proyecto Demo',
    description: 'Proyecto inicial con tareas',
  });
  logger.info(`Project '${project.name}' (ID: ${project.id}) created for user ID: ${user.id}.`);

  // Task::create equivalent: Investigar requerimientos
  await taskRepo.create({
    project_id: project.id,
    title: 'Investigar requerimientos',
    status: taskStatusEnum.PENDING,
  });
  logger.info(`Task 'Investigar requerimientos' created for project ID: ${project.id}.`);

  // Task::create equivalent: Configurar entorno
  await taskRepo.create({
    project_id: project.id,
    title: 'Configurar entorno',
    status: taskStatusEnum.IN_PROGRESS,
  });
  logger.info(`Task 'Configurar entorno' created for project ID: ${project.id}.`);

  logger.info('DatabaseSeeder finished successfully.');
}

export default { seed };