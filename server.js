import http from 'node:http';
import dotenv from 'dotenv';
import pg from 'pg';

class Database {
  constructor() {
    this.client = new pg.Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DB_NAME,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    });
  }
}

class Router {
  constructor() {
    /**
     * Store the current list of routes for out API
     */
    this.routes = {};
  }

  /**
   *
   * @param {http.ClientRequest} req
   * @param {http.ServerResponse} res
   * @returns
   */
  call(req, res) {
    if (this.routes.hasOwnProperty(req.url)) {
      this.routes[req.url](req, res);
      return true;
    }
    return false;
  }

  define(url, handler) {
    this.routes[url] = handler;
  }
}

class Response {
  #req;
  #res;

  /**
   * Extends the http response object with this class
   * @param {http.ClientRequest} req
   * @param {http.ServerResponse} res
   */
  constructor(req, res) {
    this.#req = req;
    this.#res = res;
  }

  send(text) {
    this.#res.writeHead(200, { 'Content-Type': 'text/plain' });
    this.#res.end(text);
  }

  json(data, status = 200) {
    this.#res.writeHead(status, { 'Content-Type': 'application/json' });
    this.#res.end(JSON.stringify(data));
  }

  notFound(data) {
    this.json(data, 404);
  }
}

class Application {
  constructor() {
    this.booted = false;

    this.config = this.#setupConfig();
    this.server = http.createServer();
    this.db = new Database();
    this.router = new Router();
    this.#connectDb(this.db.client).then(() => this.run());
  }

  run() {
    this.#handle();
    this.booted = true;
  }

  #setupConfig() {
    return {
      config: dotenv.config(),
    };
  }

  /**
   * This function will initialize the connection to Database
   * @param {pg.Client} client
   */
  async #connectDb(client) {
    try {
      await client.connect();
    } catch (error) {
      console.error(error);
    }
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
        if (!handled) response.notFound({ data: 'Route not found!' });

        return;
      }

      /**
       * Reponse with static files
       */
      response.send('Static Page.');
    });
    this.server.listen(process.env.PORT, () =>
      console.log(`Server is running on port "${process.env.PORT}"`)
    );
  }
}

const app = new Application();

/**
 *
 * @param {http.ClientRequest} req
 * @param {Response} res
 */
const getArticlesHandler = async (req, res) => {
  res.json([
    { id: 1, title: 'First artcile' },
    { id: 2, title: 'Second artcile' },
  ]);
};

app.router.define('/api/articles', getArticlesHandler);
