import http from 'node:http';
import Response from './response.js';
import { pathToRegexp } from 'path-to-regexp';
import StringHelper from './helpers/string.js';

/**
 * Single route type
 * @typedef {{ method: string, handler: function, options: RouteOptions, middlewares: Array<function> }} Route
 */

/**
 * Route options type
 * @typedef {{ params: Array, exact: boolean, regexp: RegExp }} RouteOptions
 */

class Router {
  constructor() {
    /**
     * Store the current list of routes
     */
    this.routes = {};
  }

  /**
   * This function checks for the existence of a route
   * and calls its middlewares and handler
   *
   * @param {http.ClientRequest} req
   * @param {Response} res
   * @returns
   */
  call(req, res) {
    const mask = `${req.method}:${StringHelper.delTrailingSlash(req.url)}`;
    const keys = Object.keys(this.routes);
    let i = keys.length;

    while (i--) {
      let route = this.routes[mask];

      /**
       * Find exact route
       */
      if (this.routes.hasOwnProperty(mask)) {
        this.#middlewares(route, req, res).then(() => route.handler(req, res));
        return;
      }

      /* Route url is not exact */
      route = this.routes[keys[i]];

      /**
       * Find route by regular expression
       */
      if (!route.options.exact && route.options.regexp !== undefined) {
        const match = req.url.match(route.options.regexp);
        if (match && keys[i].includes(req.method)) {
          if (route.options.params !== undefined) {
            req.params = {};
            route.options.params.forEach((param) => {
              req.params[param.name] = match[1];
            });
          }
          this.#middlewares(route, req, res).then(() =>
            route.handler(req, res)
          );
          return;
        }
      }
    }

    res.notFound('Page not found.');
  }

  /**
   * This function will execute every middleware of a route
   *
   * @param {Route} route Route
   * @param {http.ClientRequest} req HTTP Request
   * @param {Response} res HTTP Response
   * @returns
   */
  async #middlewares(route, req, res) {
    if (!route || !route.middlewares || !Array.isArray(route.middlewares)) {
      return;
    }

    const middlewares = route.middlewares.flat();
    if (middlewares.length !== 0) {
      for (const middleware of middlewares) {
        await middleware(req, res);
      }
    }
  }

  /**
   * Add more routes to router store
   *
   * @param {string} method HTTP Method
   * @param {string} url Route url
   * @param {function} handler Route handler function
   */
  define(method = 'GET', url, handler) {
    const mask = `${method}:${StringHelper.delTrailingSlash(url)}`;
    const options = { exact: true, regexp: undefined, params: undefined };

    if (url.includes(':')) {
      options.params = [];
      options.exact = false;
      options.regexp = pathToRegexp(url, options.params);
    }

    this.routes[mask] = {
      method,
      handler,
      options,
      middlewares: [],
    };

    return {
      /**
       * Store the list of middlewares for each router
       *
       * @param {function | [function]} middleware
       */
      middleware: (middleware) => {
        middleware = Array.isArray(middleware) ? middleware : [middleware];
        this.routes[mask].middlewares.push(middleware);
      },
    };
  }

  /**
   * GET Method route
   *
   * @param {string} url
   * @param {function} handler
   */
  get(url, handler) {
    return this.define('GET', url, handler);
  }

  /**
   * POST Method route
   *
   * @param {string} url
   * @param {function} handler
   */
  post(url, handler) {
    return this.define('POST', url, handler);
  }
}

export default new Router();
