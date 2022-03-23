import pg from 'pg';
import env from '#app/env';

const connectionString = `postgresql://${env.db.user}:${env.db.password}@${env.db.host}:${env.db.port}/${env.db.name}`;
class Database {
  constructor() {
    this.client = new pg.Client({
      connectionString:
        process.env.NODE_ENV === 'production' && process.env.DATABASE_URL
          ? process.env.DATABASE_URL
          : connectionString,
      ssl: process.env.DATABASE_URL
        ? {
            rejectUnauthorized: false,
          }
        : false,
    });
  }
}

export default new Database();
