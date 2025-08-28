/* migrated from database/seeders/DatabaseSeeder.php */

import TaskStatus from '../../enums/TaskStatus.js';

/**
 * Seeds the database with initial demo data.
 * @param {object} deps - Dependencies for the seeder.
 * @param {object} deps.userRepo - Repository for user data. Must have methods like findByEmail and create (or an upsert method).
 * @param {object} deps.projectRepo - Repository for project data. Must have a create method.
 * @param {object} deps.taskRepo - Repository for task data. Must have a create method.
 * @param {object} deps.hasher - Service for hashing passwords. Must have a hash method (e.g., from bcrypt or argon2).
 * @param {object} [deps.logger] - Optional logger instance (e.g., Winston, pino, or console).
 */
export async function seed(deps = {}) {
  const { userRepo, projectRepo, taskRepo, hasher, logger = console } = deps;
// Basic dependency validation
  if (!userRepo || !projectRepo || !taskRepo || !hasher) {
    logger.error('Missing required dependencies for DatabaseSeeder. Ensure userRepo, projectRepo, taskRepo, and hasher are provided.');
    throw new Error('Missing required dependencies for DatabaseSeeder.');
  }

  logger.info('Starting DatabaseSeeder...');

  // Equivalent to User::firstOrCreate(
  //     ['email' => 'demo@example.com'],
  //     ['name' => 'Demo', 'password' => Hash::make('password')]
  // );
  let user = await userRepo.findByEmail('demo@example.com');
  if (!user) {
    logger.info('Demo user not found, creating...');
    const hashedPassword = await hasher.make('password');
    user = await userRepo.create({
      email: 'demo@example.com',
      name: 'Demo',
      password: hashedPassword,
    });
    logger.info(`Created demo user with ID: ${user.id}`);
  } else {
    logger.info(`Demo user already exists with ID: ${user.id}`);
  }

  // Equivalent to Project::create([...]);
  logger.info('Creating demo project...');
  const project = await projectRepo.create({
    user_id: user.id, // Maps from user_id in PHP
    name: 'Proyecto Demo',
    description: 'Proyecto inicial con tareas',
  });
  logger.info(`Created demo project with ID: ${project.id}`);

  // Equivalent to Task::create([...]); (first task)
  logger.info('Creating first demo task...');
  await taskRepo.create({
    project_id: project.id, // Maps from project_id in PHP
    title: 'Investigar requerimientos',
    status: TaskStatus.PENDING, // Maps from App\Enums\TaskStatus::PENDING
  });
  logger.info('Created first demo task.');

  // Equivalent to Task::create([...]); (second task)
  logger.info('Creating second demo task...');
  await taskRepo.create({
    project_id: project.id, // Maps from project_id in PHP
    title: 'Configurar entorno',
    status: TaskStatus.IN_PROGRESS, // Maps from App\Enums\TaskStatus::IN_PROGRESS
  });
  logger.info('Created second demo task.');

  logger.info('DatabaseSeeder finished successfully.');
}

// Export the seed function as a default object, as required.
export default { seed };
