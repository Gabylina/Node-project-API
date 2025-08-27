/* migrated from config/database.php */\
\
import path from 'path';\
\
export default {\
  default: process.env.DB_CONNECTION ?? 'sqlite',\
  connections: {\
    sqlite: {\
      driver: 'sqlite',\
      url: process.env.DB_URL,\
      database: process.env.DB_DATABASE ?? path.resolve(process.cwd(), 'database/database.sqlite'),\
      prefix: '',\
      foreign_key_constraints: process.env.DB_FOREIGN_KEYS ? (process.env.DB_FOREIGN_KEYS === 'true') : true,\
      busy_timeout: null,\
      journal_mode: null,\
      synchronous: null,\
    },\
    mysql: {\
      driver: 'mysql',\
      url: process.env.DB_URL,\
      host: process.env.DB_HOST ?? '127.0.0.1',\
      port: parseInt(process.env.DB_PORT ?? '3306', 10),\
      database: process.env.DB_DATABASE ?? 'laravel',\
      username: process.env.DB_USERNAME ?? 'root',\
      password: process.env.DB_PASSWORD ?? '',\
      unix_socket: process.env.DB_SOCKET ?? '',\
      charset: process.env.DB_CHARSET ?? 'utf8mb4',\
      collation: process.env.DB_COLLATION ?? 'utf8mb4_unicode_ci',\
      prefix: '',\
      prefix_indexes: true,\
      strict: true,\
      engine: null,\
      options: process.env.PDO_MYSQL ? { PDO::MYSQL_ATTR_SSL_CA: process.env.MYSQL_ATTR_SSL_CA } : {},\
    },\
    mariadb: {\
      driver: 'mariadb',\
      url: process.env.DB_URL,\
      host: process.env.DB_HOST ?? '127.0.0.1',\
      port: parseInt(process.env.DB_PORT ?? '3306', 10),\
      database: process.env.DB_DATABASE ?? 'laravel',\
      username: process.env.DB_USERNAME ?? 'root',\
      password: process.env.DB_PASSWORD ?? '',\
      unix_socket: process.env.DB_SOCKET ?? '',\
      charset: process.env.DB_CHARSET ?? 'utf8mb4',\
      collation: process.env.DB_COLLATION ?? 'utf8mb4_unicode_ci',\
      prefix: '',\
      prefix_indexes: true,\
      strict: true,\
      engine: null,\
      options: process.env.PDO_MYSQL ? { PDO::MYSQL_ATTR_SSL_CA: process.env.MYSQL_ATTR_SSL_CA } : {},\
    },\
    pgsql: {\
      driver: 'pgsql',\
      url: process.env.DB_URL,\
      host: process.env.DB_HOST ?? '127.0.0.1',\
      port: parseInt(process.env.DB_PORT ?? '5432', 10),\
      database: process.env.DB_DATABASE ?? 'laravel',\
      username: process.env.DB_USERNAME ?? 'root',\
      password: process.env.DB_PASSWORD ?? '',\
      charset: process.env.DB_CHARSET ?? 'utf8',\
      prefix: '',\
      prefix_indexes: true,\
      search_path: 'public',\
      sslmode: 'prefer',\
    },\
    sqlsrv: {\
      driver: 'sqlsrv',\
      url: process.env.DB_URL,\
      host: process.env.DB_HOST ?? 'localhost',\
      port: parseInt(process.env.DB_PORT ?? '1433', 10),\
      database: process.env.DB_DATABASE ?? 'laravel',\
      username: process.env.DB_USERNAME ?? 'root',\
      password: process.env.DB_PASSWORD ?? '',\
      charset: process.env.DB_CHARSET ?? 'utf8',\
      prefix: '',\
      prefix_indexes: true,\
      // 'encrypt' => env('DB_ENCRYPT', 'yes'),\
      // 'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'false'),\
    },\
  },\
  migrations: {\
    table: 'migrations',\
    update_date_on_publish: true,\
  },\
  redis: {\
    client: process.env.REDIS_CLIENT || 'redis',\
    options: {\
      cluster: process.env.REDIS_CLUSTER ?? 'redis',\
      prefix: process.env.REDIS_PREFIX ?? `\${(process.env.APP_NAME ?? 'laravel').toLowerCase()}-database-`,\
      persistent: process.env.REDIS_PERSISTENT === 'true',\
    },\
    default: {\
      url: process.env.REDIS_URL,\
      host: process.env.REDIS_HOST ?? '127.0.0.1',\
      username: process.env.REDIS_USERNAME,\
      password: process.env.REDIS_PASSWORD,\
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),\
      database: process.env.REDIS_DB ?? '0',\
    },\
    cache: {\
      url: process.env.REDIS_URL,\
      host: process.env.REDIS_HOST ?? '127.0.0.1',\
      username: process.env.REDIS_USERNAME,\
      password: process.env.REDIS_PASSWORD,\
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),\
      database: process.env.REDIS_CACHE_DB ?? '1',\
    },\
  },\
};\
