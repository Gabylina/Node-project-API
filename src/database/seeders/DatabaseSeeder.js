/* migrated from database/seeders/DatabaseSeeder.php */

// TODO: Import necessary repositories or factories. Example:
// import { userRepository } from '../repositories/userRepository.js';
// import { projectRepository } from '../repositories/projectRepository.js';
// import { taskRepository } from '../repositories/taskRepository.js';

// TODO: If you have a JavaScript equivalent for App\Enums\TaskStatus, import it here.
// For example:
// import { TaskStatus } from '../enums/TaskStatus.js';

// TODO: If you have a password hashing utility (e.g., bcrypt service), import it here.
// import { bcryptService } from '../utils/bcryptService.js';

export async function seed(deps = {}) {
  // Destructure dependencies, providing sensible TODO defaults for repositories/factories.
  // These mock implementations provide basic functionality but should be replaced with real data access logic.
  const {
    userRepository = {
      // TODO: Implement actual findOrCreate logic for your user data store.
      // This mock just simulates finding or creating and returns the combined data with a mock ID.
      findOrCreate: async (criteria, data) => {
        console.warn('User repository `findOrCreate` is using a mock implementation. Provide a real one via `deps`.');
        // In a real scenario, you'd check if a user matching 'criteria' exists, then return it or create a new one.
        return { id: `mock-user-id-${Date.now()}`, ...data, ...criteria };
      },
      // A 'create' method might also be needed for consistency, though findOrCreate is used here.
      create: async (data) => {
        console.warn('User repository `create` is using a mock implementation. Provide a real one via `deps`.');
        return { id: `mock-user-id-${Date.now()}`, ...data };
      },
    },
    projectRepository = {
      // TODO: Implement actual create logic for your project data store.
      create: async (data) => {
        console.warn('Project repository `create` is using a mock implementation. Provide a real one via `deps`.');
        return { id: `mock-project-id-${Date.now()}`, ...data };
      },
    },
    taskRepository = {
      // TODO: Implement actual create logic for your task data store.
      create: async (data) => {
        console.warn('Task repository `create` is using a mock implementation. Provide a real one via `deps`.');
        return { id: `mock-task-id-${Date.now()}`, ...data };
      },
    },
    // TODO: Provide a real logger implementation (e.g., Winston, Pino) if needed.
    logger = console, // Default to console for logging
    // TODO: Implement a secure password hashing service (e.g., using 'bcrypt' or 'argon2').
    // If not provided, passwords will be stored in plain text or handled directly by the repository.
    passwordHasher = { hash: async (password) => password }, // Default: returns password as-is (UNSAFE for production)
  } = deps;

  logger.info('Running DatabaseSeeder...');

  // PHP: $user = User::firstOrCreate(
  //          ['email' => 'demo@example.com'],
  //          ['name' => 'Demo', 'password' => Hash::make('password')]
  //      );
  const user = await userRepository.findOrCreate(
    { email: 'demo@example.com' },
    {
      name: 'Demo',
      password: await passwordHasher.hash('password'), // Hash the password using the injected hasher
    }
  );
  logger.info(`User upserted: ${user.email} (ID: ${user.id})`);

  // PHP: $project = Project::create([
  //            'user_id' => $user->id,
  //            'name' => 'Proyecto Demo',
  //            'description' => 'Proyecto inicial con tareas',
  //        ]);
  const project = await projectRepository.create({
    user_id: user.id,
    name: 'Proyecto Demo',
    description: 'Proyecto inicial con tareas',
  });
  logger.info(`Project created: ${project.name} (ID: ${project.id})`);

  // PHP: Task::create([
  //            'project_id' => $project->id,
  //            'title' => 'Investigar requerimientos',
  //            'status' => TaskStatus::PENDING,
  //        ]);
  // TODO: Replace 'pending' with TaskStatus.PENDING if a JS enum for TaskStatus exists.
  await taskRepository.create({
    project_id: project.id,
    title: 'Investigar requerimientos',
    status: 'pending', // Corresponds to App\Enums\TaskStatus::PENDING
  });
  logger.info(`Task created: Investigar requerimientos`);

  // PHP: Task::create([
  //            'project_id' => $project->id,
  //            'title' => 'Configurar entorno',
  //            'status' => TaskStatus::IN_PROGRESS,
  //        ]);
  // TODO: Replace 'in_progress' with TaskStatus.IN_PROGRESS if a JS enum for TaskStatus exists.
  await taskRepository.create({
    project_id: project.id,
    title: 'Configurar entorno',
    status: 'in_progress', // Corresponds to App\Enums\TaskStatus::IN_PROGRESS
  });
  logger.info(`Task created: Configurar entorno`);

  logger.info('DatabaseSeeder finished.');
}

export default { seed };
