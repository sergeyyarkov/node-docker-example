import dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/.env' });

const env = {
  app: {
    port: parseInt(process.env.PORT, 10),
  },
  db: {
    user: process.env.PG_USER.toString(),
    host: process.env.PG_HOST.toString(),
    name: process.env.PG_DB_NAME.toString(),
    password: process.env.PG_PASSWORD.toString(),
    port: parseInt(process.env.PG_PORT, 10),
  },
};

export default env;
