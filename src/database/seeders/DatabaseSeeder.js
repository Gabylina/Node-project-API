/* migrated from database/seeders/DatabaseSeeder.php */

// TODO: Import or inject concrete repository implementations for User, Project, and Task.
// Example:
// import { UserRepository } from '../repositories/UserRepository.js';
// import { ProjectRepository } from '../repositories/ProjectRepository.js';
// import { TaskRepository } from '../repositories/TaskRepository.js';

// TODO: Import or define the TaskStatus enum.
// For now, defining it inline as a simple object. Consider a dedicated `src/enums/TaskStatus.js` module.
const TaskStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    // Add other statuses if they exist in the PHP enum
};

// TODO: Import or inject a hashing utility for passwords, e.g., bcrypt or argon2.
// Example:
// import { HasherService } from '../services/HasherService.js';

export async function seed(deps = {}) {
    // Ensure necessary dependencies are provided or fall back to sensible defaults/stubs.
    // In a real application, you'd typically ensure these are always injected.
    const userRepo = deps.userRepo; // e.g., new UserRepository();
    const projectRepo = deps.projectRepo; // e.g., new ProjectRepository();
    const taskRepo = deps.taskRepo; // e.g., new TaskRepository();
    const hasher = deps.hasher; // e.g., new HasherService();
    const logger = deps.logger || console; // Basic logger fallback

    if (!userRepo || !projectRepo || !taskRepo) {
        logger.error('Missing required repository dependencies for DatabaseSeeder.');
        throw new Error('Missing repository dependencies.');
    }

    logger.log('Starting DatabaseSeeder...');

    // PHP: User::firstOrCreate(
    //          ['email' => 'demo@example.com'],
    //          ['name' => 'Demo', 'password' => Hash::make('password')]
    //      );
    let user = await userRepo.findByEmail('demo@example.com');
    if (!user) {
        // TODO: Replace 'password_hashed_placeholder' with an actual hashed password.
        // If a hasher service is provided via `deps.hasher`:
        // const hashedPassword = await hasher.make('password');
        // user = await userRepo.create({ ... password: hashedPassword });
        user = await userRepo.create({
            email: 'demo@example.com',
            name: 'Demo',
            password: 'password_hashed_placeholder', // Placeholder for a hashed password
        });
        logger.log('Created user: demo@example.com');
    } else {
        logger.log('User demo@example.com already exists, skipping creation.');
    }

    // PHP: Project::create([
    //          'user_id' => $user->id,
    //          'name' => 'Proyecto Demo',
    //          'description' => 'Proyecto inicial con tareas',
    //      ]);
    // TODO: Consider adding logic to prevent duplicate project creation if `create` is not idempotent.
    const project = await projectRepo.create({
        user_id: user.id,
        name: 'Proyecto Demo',
        description: 'Proyecto inicial con tareas',
    });
    logger.log(`Created project: ${project.name}`);

    // PHP: Task::create([
    //          'project_id' => $project->id,
    //          'title' => 'Investigar requerimientos',
    //          'status' => TaskStatus::PENDING,
    //      ]);
    await taskRepo.create({
        project_id: project.id,
        title: 'Investigar requerimientos',
        status: TaskStatus.PENDING,
    });
    logger.log('Created task: Investigar requerimientos');

    // PHP: Task::create([
    //          'project_id' => $project->id,
    //          'title' => 'Configurar entorno',
    //          'status' => TaskStatus::IN_PROGRESS,
    //      ]);
    await taskRepo.create({
        project_id: project.id,
        title: 'Configurar entorno',
        status: TaskStatus.IN_PROGRESS,
    });
    logger.log('Created task: Configurar entorno');

    logger.log('DatabaseSeeder completed.');
}

export default { seed };
