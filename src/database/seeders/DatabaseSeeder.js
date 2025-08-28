/* migrated from database/seeders/DatabaseSeeder.php */

import TaskStatus from '../../enums/TaskStatus.js';

export async function seed(deps = {}) {
  // TODO: Inject UserRepository (e.g., a class with `findByEmail` and `create` methods)
  // Example: const userRepo = deps.userRepo || new SomeConcreteUserRepository();
  const userRepo = deps.userRepo;

  // TODO: Inject ProjectRepository (e.g., a class with a `create` method)
  // Example: const projectRepo = deps.projectRepo || new SomeConcreteProjectRepository();
  const projectRepo = deps.projectRepo;

  // TODO: Inject TaskRepository (e.g., a class with a `create` method)
  // Example: const taskRepo = deps.taskRepo || new SomeConcreteTaskRepository();
  const taskRepo = deps.taskRepo;

  // TODO: Inject PasswordHasher (e.g., a service that hashes passwords using bcrypt, with a `hash` method)
  // Example: const hasher = deps.hasher || new BcryptPasswordHasher();
  const hasher = deps.hasher;

  // TODO: Inject TaskStatus Enum (e.g., an object like { PENDING: 'pending', IN_PROGRESS: 'in_progress' })
  // Example: const TaskStatus = deps.TaskStatus || TaskStatusEnum;
  const TaskStatus = deps.TaskStatus;

  // Basic validation for critical dependencies
  if (!userRepo || typeof userRepo.findByEmail !== 'function' || typeof userRepo.create !== 'function') {
    throw new Error('Dependency "userRepo" (with findByEmail and create methods) is required.');
  }
  if (!projectRepo || typeof projectRepo.create !== 'function') {
    throw new Error('Dependency "projectRepo" (with a create method) is required.');
  }
  if (!taskRepo || typeof taskRepo.create !== 'function') {
    throw new Error('Dependency "taskRepo" (with a create method) is required.');
  }
  if (!hasher || typeof hasher.hash !== 'function') {
    throw new Error('Dependency "hasher" (with a hash method) is required.');
  }
  if (!TaskStatus || !TaskStatus.PENDING || !TaskStatus.IN_PROGRESS) {
    throw new Error('Dependency "TaskStatus" (with PENDING and IN_PROGRESS properties) is required.');
  }

  // Equivalent of User::firstOrCreate
  let user = await userRepo.findByEmail('demo@example.com');
  if (!user) {
    const hashedPassword = await hasher.hash('password');
    user = await userRepo.create({
      name: 'Demo',
      email: 'demo@example.com',
      password: hashedPassword,
    });
    // TODO: Add logging if desired, e.g., deps.logger.info('Created user: ...');
  } else {
    // TODO: Add logging if desired, e.g., deps.logger.info('Found existing user: ...');
  }

  // Equivalent of Project::create
  const project = await projectRepo.create({
    user_id: user.id, // Assuming the 'user' object has an 'id' property after creation/finding
    name: 'Proyecto Demo',
    description: 'Proyecto inicial con tareas',
  });
  // TODO: Add logging if desired, e.g., deps.logger.info('Created project: ...');

  // Equivalent of Task::create (first)
  await taskRepo.create({
    project_id: project.id, // Assuming the 'project' object has an 'id' property after creation
    title: 'Investigar requerimientos',
    status: TaskStatus.PENDING,
  });
  // TODO: Add logging if desired

  // Equivalent of Task::create (second)
  await taskRepo.create({
    project_id: project.id,
    title: 'Configurar entorno',
    status: TaskStatus.IN_PROGRESS,
  });
  // TODO: Add logging if desired
}

export default { seed };