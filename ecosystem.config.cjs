module.exports = {
  apps: [
    {
      name: 'babyshalls-web',
      cwd: './apps',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '900M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
