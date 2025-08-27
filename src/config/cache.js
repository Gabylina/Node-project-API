/* migrated from config/cache.php */

import { storage_path } from '../helpers.js';

export default {
  default: process.env.CACHE_DRIVER ?? 'database',
  stores: {
    array: {
      driver: 'array',
      serialize: false,
    },
    database: {
      driver: 'database',
      connection: process.env.DB_CACHE_CONNECTION,
      table: process.env.DB_CACHE_TABLE ?? 'cache',
      lock_connection: process.env.DB_CACHE_LOCK_CONNECTION,
      lock_table: process.env.DB_CACHE_LOCK_TABLE,
    },
    file: {
      driver: 'file',
      path: storage_path('framework/cache/data'),
      lock_path: storage_path('framework/cache/data'),
    },
    memcached: {
      driver: 'memcached',
      persistent_id: process.env.MEMCACHED_PERSISTENT_ID,
      sasl: [
        process.env.MEMCACHED_USERNAME,
        process.env.MEMCACHED_PASSWORD,
      ],
      options: {},
      servers: [
        {
          host: process.env.MEMCACHED_HOST ?? '127.0.0.1',
          port: parseInt(process.env.MEMCACHED_PORT ?? 11211, 10),
          weight: 100,
        },
      ],
    },
    redis: {
      driver: 'redis',
      connection: process.env.REDIS_CACHE_CONNECTION ?? 'cache',
      lock_connection: process.env.REDIS_CACHE_LOCK_CONNECTION ?? 'default',
    },
    dynamodb: {
      driver: 'dynamodb',
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION ?? 'us-east-1',
      table: process.env.DYNAMODB_CACHE_TABLE ?? 'cache',
      endpoint: process.env.DYNAMODB_ENDPOINT,
    },
    octane: {
      driver: 'octane',
    },
  },
  prefix: process.env.CACHE_PREFIX ?? 'laravel-cache-',
};
