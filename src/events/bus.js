cat > src/events/bus.js <<'EOF'
/* scaffolded: simple event bus */
import { EventEmitter } from 'events';

export const bus = new EventEmitter();

/**
 * Emit an event
 * @param {string} eventName
 * @param {object} payload
 */
export function emit(eventName, payload) {
  bus.emit(eventName, payload);
}

export default { bus, emit };
EOF
