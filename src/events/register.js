cat > src/events/register.js <<'EOF'
/* scaffolded: listeners register */
import { bus } from './bus.js';

import { ProjectCreated } from './ProjectCreated.js';
import { TaskStatusUpdated } from './TaskStatusUpdated.js';

import { SendProjectCreatedNotification } from '../listeners/SendProjectCreatedNotification.js';
import { SendTaskStatusNotification } from '../listeners/SendTaskStatusNotification.js';

/**
 * Registrar listeners en el bus
 * @param {object} deps Dependencias inyectadas (repos, notifier, logger, etc.)
 */
export function register(deps = {}) {
  // ProjectCreated
  const onProjectCreated = new SendProjectCreatedNotification();
  bus.on(ProjectCreated.event, async (payload) => {
    try { await onProjectCreated.handle(payload, deps); }
    catch (err) { console.error('[listener][ProjectCreated]', err); }
  });

  // TaskStatusUpdated
  const onTaskStatusUpdated = new SendTaskStatusNotification();
  bus.on(TaskStatusUpdated.event, async (payload) => {
    try { await onTaskStatusUpdated.handle(payload, deps); }
    catch (err) { console.error('[listener][TaskStatusUpdated]', err); }
  });
}

export default { register };
EOF
