import fs from 'node:fs';
import db from '../db.js';

class DbHelper {
  /**
   * Run query from `sql` file and close connection
   *
   * @param {string} path Path to `.sql` file
   */
  static async runQueryFromFile(path) {
    try {
      const { client } = db;
      client.connect();

      const query = fs.readFileSync(path).toString();

      await client.query(query);
      console.log(`[LOG]: SQL: ${query}`);
      await client.end();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

export default DbHelper;
