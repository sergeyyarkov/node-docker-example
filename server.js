import http from 'node:http';
import fs from 'node:fs';
import mime from 'mime-types';
import hbs from 'handlebars';
import env from './env.js';
import db from './db.js';
import router from './router.js';
import Response from './response.js';
import FileHelper from './helpers/file.js';
import './preloads/index.js';

class Application {
  constructor() {
    this.booted = false;
    this.server = http.createServer();
    this.router = router;
    this.db = db;
    this.hbs = hbs;
  }

  async run() {
    try {
      await this.#connectDb(this.db.client);
      this.#handle();
      this.booted = true;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * This function will initialize the connection to Database
   * @param {pg.Client} client
   */
  async #connectDb(client) {
    await client.connect().catch((error) => {
      console.error(error);
      throw new Error(error);
    });
  }

  #handle() {
    this.server.on('request', (req, res) => {
      const response = new Response(req, res);
      this.router.call(req, response);
    });
    this.server.listen(env.app.port, () =>
      console.log(`[LOG]: Server is running on port "${env.app.port}"`)
    );
  }

  /**
   * Serve folder with static files
   *
   * @param {string} path Path to static files
   */
  serve(path) {
    const files = FileHelper.readDirRecursive(path);
    /**
     * At the moment, this process is called only once.
     * It would be nice to watch for directory changes and declare new routes again
     */
    for (const file of files) {
      router.define('GET', `/${file}`, (req, { res }) => {
        const data = fs.readFileSync(file);
        const contentType = mime.lookup(file);

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    }
  }
}

export default Application;
