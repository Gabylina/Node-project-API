/* migrated from database/seeders/DatabaseSeeder.php */
import TaskStatus from '../../enums/TaskStatus.js';

// TODO: Adjust import paths based on your project structure.
// import { UserRepository } from '../repositories/UserRepository.js';
// import { ProjectRepository } from '../repositories/ProjectRepository.js';
// import { TaskRepository } from '../repositories/TaskRepository.js';
// import { TaskStatus } from '../enums/TaskStatus.js'; // If you migrate enums to a JS file

export async function seed(deps = {}) {
  const { userRepo, projectRepo, taskRepo, hasher, logger = console } = deps;
  // --- Dependency Injection Setup ---
  // Replace these placeholder implementations with actual repositories and services
  // that interact with your database and handle business logic.
  const userRepo = deps.userRepo || {
    firstOrCreate: async (findBy, createData) => {
      // TODO: Implement actual logic here:
      // 1. Check if a user exists in your database based on `findBy` criteria (e.g., email).
      // 2. If the user exists, return that existing user record.
      // 3. If no user is found, insert `createData` into your users table and return the newly created user.
      console.warn('Using placeholder userRepo.firstOrCreate. Replace with actual DB logic.');
      const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `user-${Math.random().toString(36).substring(2, 9)}`; // For simulation
      return { id, ...findBy, ...createData };
    }
  };

  const projectRepo = deps.projectRepo || {
    create: async (data) => {
      // TODO: Implement actual logic here: Insert `data` into your projects table.
      console.warn('Using placeholder projectRepo.create. Replace with actual DB logic.');
      const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `project-${Math.random().toString(36).substring(2, 9)}`; // For simulation
      return { id, ...data };
    }
  };

  const taskRepo = deps.taskRepo || {
    create: async (data) => {
      // TODO: Implement actual logic here: Insert `data` into your tasks table.
      console.warn('Using placeholder taskRepo.create. Replace with actual DB logic.');
      const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `task-${Math.random().toString(36).substring(2, 9)}`; // For simulation
      return { id, ...data };
    }
  };

  const hasher = deps.hasher || {
    make: async (password) => {
      // TODO: Implement actual password hashing (e.g., using a library like `bcrypt` or `argon2`).
      console.warn('Using placeholder hasher.make. Replace with actual hashing logic.');
      const salt = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8) : Math.random().toString(36).substring(2, 10);
      return `hashed_${password}_${salt}`; // For simulation
    }
  };

  const logger = deps.logger || console; // Use provided logger or default to console

  // --- Seeder Logic ---
  try {
    const hashedPassword = await hasher.make('password');

    // Laravel PHP: $user = User::firstOrCreate(['email' => 'demo@example.com'], ['name' => 'Demo', 'password' => Hash::make('password')]);
    const user = await userRepo.firstOrCreate(
      { email: 'demo@example.com' },
      { name: 'Demo', password: hashedPassword }
    );
    logger.log(`Seeded/found user with ID: ${user.id}`);

    // Laravel PHP: $project = Project::create(['user_id' => $user->id, 'name' => 'Proyecto Demo', 'description' => 'Proyecto inicial con tareas']);
    const project = await projectRepo.create({
      user_id: user.id, // PHP's snake_case (user_id) becomes JS camelCase (user_id) by convention
      name: 'Proyecto Demo',
      description: 'Proyecto inicial con tareas',
    });
    logger.log(`Seeded project with ID: ${project.id}`);

    // Laravel PHP: Task::create(['project_id' => $project->id, 'title' => 'Investigar requerimientos', 'status' => TaskStatus::PENDING]);
    await taskRepo.create({
      project_id: project.id, // PHP's snake_case (project_id) becomes JS camelCase (project_id) by convention
      title: 'Investigar requerimientos',
      // TODO: If you have migrated `TaskStatus` enum to a JS file (e.g., `../enums/TaskStatus.js`), use `TaskStatus.PENDING`.
      // Otherwise, use a string literal that represents the status.
      status: TaskStatus.PENDING, // Assuming 'pending' as the string representation of TaskStatus::PENDING
    });
    logger.log('Seeded task: "Investigar requerimientos"');

    // Laravel PHP: Task::create(['project_id' => $project->id, 'title' => 'Configurar entorno', 'status' => TaskStatus::IN_PROGRESS]);
    await taskRepo.create({
      project_id: project.id,
      title: 'Configurar entorno',
      // TODO: If you have migrated `TaskStatus` enum, use `TaskStatus.IN_PROGRESS`.
      status: TaskStatus.IN_PROGRESS, // Assuming 'in_progress' as the string representation of TaskStatus::IN_PROGRESS
    });
    logger.log('Seeded task: "Configurar entorno"');

    logger.log('Database seeding for DatabaseSeeder completed successfully.');
  } catch (error) {
    logger.error('Error during DatabaseSeeder execution:', error);
    // Depending on your seeder runner implementation, you might want to re-throw or handle the error differently.
    throw error;
  }
}

export default { seed };