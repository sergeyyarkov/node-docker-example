import http from 'node:http';
import env from './env.js';
import db from './db.js';
import router from './router.js';
import Response from './response.js';
import './preloads/index.js';

class Application {
  constructor() {
    this.booted = false;
    this.server = http.createServer();
    this.router = router;
    this.db = db;
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

      /**
       * Reponse with API data
       */
      if (req.url.includes('api')) {
        const handled = this.router.call(req, response);

        /**
         * Undefined route
         */
        if (!handled) response.notFound('Route not found!');

        return;
      }

      /**
       * Reponse with static files
       */
      response.send('Static Page.');
    });
    this.server.listen(env.app.port, () =>
      console.log(`[LOG]: Server is running on port "${env.app.port}"`)
    );
  }
}

const app = new Application();

app.run().catch((error) => {
  console.error('[ERR]: Error on startup the application.', error);
});

process.on('SIGINT', () => {
  console.log(`[LOG]: Graceefully stopping the server...`);
  app.server.close();
  process.exit();
});
