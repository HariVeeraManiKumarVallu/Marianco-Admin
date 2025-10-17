module.exports = {
  apps: [
    {
      name: 'marianco-admin',
      cwd: 'c:/Users/manik/Downloads/Workspace/marianco-admin',
      script: 'node',
      args: './node_modules/@strapi/strapi/bin/strapi.js start',
      env: { NODE_ENV: 'production' },
      env_production: { NODE_ENV: 'production' },
      autorestart: true,
    },
    {
      name: 'marianco-web',
      cwd: 'c:/Users/manik/Downloads/Workspace/Marianco',
      script: 'node',
      args: './node_modules/next/dist/bin/next start -p 3000',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_STRAPI_API_URL: 'https://api.yourdomain.com/api',
      },
      env_production: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_STRAPI_API_URL: 'https://api.yourdomain.com/api',
      },
      autorestart: true,
    },
  ],
};