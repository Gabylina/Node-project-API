/* migrated from config/filesystems.php */

import path from 'path';

const storage_path = (relativePath) => path.resolve(process.cwd(), 'storage', relativePath);
const public_path = (relativePath) => path.resolve(process.cwd(), 'public', relativePath);

export default {
  default: process.env.FILESYSTEM_DISK ?? 'local',
  disks: {
    local: {
      driver: 'local',
      root: storage_path('app/private'),
      serve: true,
      throw: false,
      report: false,
    },
    public: {
      driver: 'local',
      root: storage_path('app/public'),
      url: process.env.APP_URL + '/storage',
      visibility: 'public',
      throw: false,
      report: false,
    },
    s3: {
      driver: 's3',
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION,
      bucket: process.env.AWS_BUCKET,
      url: process.env.AWS_URL,
      endpoint: process.env.AWS_ENDPOINT,
      use_path_style_endpoint: process.env.AWS_USE_PATH_STYLE_ENDPOINT === 'true',
      throw: false,
      report: false,
    },
  },
  links: {
    [public_path('storage')]: storage_path('app/public'),
  },
};
