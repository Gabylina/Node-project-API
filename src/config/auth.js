/* migrated from config/sanctum.php + config/auth.php */
export default {
  default: 'web',
  guards: {},
  providers: {},
  passwords: {},
  sanctum: {
    stateful: process.env.SANCTUM_STATEFUL_DOMAINS ? process.env.SANCTUM_STATEFUL_DOMAINS.split(',') : ['localhost', 'localhost:3000', '127.0.0.1', '127.0.0.1:8000', '::1'],
    expiration: null,
    prefix: process.env.SANCTUM_TOKEN_PREFIX || ''
  }
};
