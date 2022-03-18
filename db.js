import pg from 'pg';
import env from '#app/env';

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
