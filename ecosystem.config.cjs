const path = require('path');

// eslint-disable-next-line no-undef
const projectRoot = path.resolve(__dirname);

module.exports = {
  apps: [
    {
      name: 'whatsapp-command-buddy',
      script: path.join(projectRoot, 'index.js'),
      watch: false,
      max_memory_restart: '200M',
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        CHROMIUM_PATH: '/usr/bin/chromium-browser',
      },
      error_file: path.join(projectRoot, 'logs/err.log'),
      out_file: path.join(projectRoot, 'logs/out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      time: true,
      exp_backoff_restart_delay: 100,
      kill_timeout: 10000,
    },
  ],
};
