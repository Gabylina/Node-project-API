/* migrated from config/session.php */

const appName = process.env.APP_NAME || 'laravel';

export default {
  driver: process.env.SESSION_DRIVER || 'database',
  lifetime: parseInt(process.env.SESSION_LIFETIME ?? 120, 10),
  expire_on_close: process.env.SESSION_EXPIRE_ON_CLOSE === 'true',
  encrypt: process.env.SESSION_ENCRYPT === 'true',
  files: process.env.SESSION_FILE || 'storage/framework/sessions',
  connection: process.env.SESSION_CONNECTION,
  table: process.env.SESSION_TABLE || 'sessions',
  store: process.env.SESSION_STORE,
  cookie: process.env.SESSION_COOKIE || appName.toLowerCase().replace(/\s+/g, '-') + '-session',
  path: process.env.SESSION_PATH || '/',
  domain: process.env.SESSION_DOMAIN,
  secure: process.env.SESSION_SECURE_COOKIE === 'true',
  http_only: process.env.SESSION_HTTP_ONLY !== 'false',
  same_site: process.env.SESSION_SAME_SITE || 'lax',
  partitioned: process.env.SESSION_PARTITIONED_COOKIE === 'true',
};
