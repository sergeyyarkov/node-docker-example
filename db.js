import pg from 'pg';
import env from './env.js';

class Database {
  constructor() {
    this.client = new pg.Client({
      user: env.db.user,
      host: env.db.host,
      database: env.db.name,
      password: env.db.password,
      port: env.db.port,
    });
  }
}

export default new Database();
