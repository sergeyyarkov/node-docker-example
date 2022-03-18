import http from 'node:http';
import fs from 'node:fs';
import qs from 'node:querystring';
import path from 'node:path';
import mime from 'mime-types';
import hbs from 'handlebars';
import env from '#app/env';
import db from '#app/db';
import router from '#app/router';
import Response from '#app/response';
import FileHelper from '#helpers/file';
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
    this.server.on('request', async (req, res) => {
      const response = new Response(req, res);
      this.router.call(req, response);

      // const buffer = Buffer.alloc(parseInt(req.headers['content-length'], 10));

      // req.on('data', (chunk) => {
      //   if (req.method === 'POST') {
      //     console.log(chunk);
      //     // console.log(buffer.toString());
      //     // const buffer = Buffer.alloc(chunk.length)
      //   }
      // });
    });
    this.server.listen(env.app.port, () =>
      console.log(`[LOG]: Server is running on port "${env.app.port}"`)
    );
  }

  /**
   * Serve folder with static files
   *
   * @param {string} folder Path to static files
   */
  serve(folder) {
    const files = FileHelper.readDirRecursive(folder);
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

  /**
   * Register handlebars partials
   *
   * @param {string} folder Path to `partials` folder
   */
  partials(folder) {
    const partials = FileHelper.readDirRecursive(folder);

    /**
     * Register partials from files
     */
    for (const partial of partials) {
      const fileName = path.basename(partial);
      this.hbs.registerPartial(
        path.parse(fileName).name,
        fs.readFileSync(partial, 'utf8').toString()
      );
    }
  }
}

export default Application;
