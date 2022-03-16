import http from 'node:http';
import { pathToRegexp } from 'path-to-regexp';
import StringHelper from './helpers/string.js';

class Router {
  constructor() {
    /**
     * Store the current list of routes
     */
    this.routes = {};
  }

  /**
   * This function checks for the existence of a route and calls its handler
   *
   * @param {http.ClientRequest} req
   * @param {http.ServerResponse} res
   * @returns {boolean} Is route has been handled
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
        this.#middlewares(route, req, res);
        route.handler(req, res);
        return true;
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
          this.#middlewares(route, req, res);
          route.handler(req, res);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * This function will execute every middleware of a route
   *
   * @param {*} route
   * @param {http.ClientRequest} req
   * @param {Response} res
   * @returns
   */
  #middlewares(route, req, res) {
    if (!route || !route.middlewares || !Array.isArray(route.middleware)) {
      return;
    }

    const middlewares = route.middlewares.flat();
    if (middlewares.length !== 0) {
      for (const middleware of middlewares) {
        middleware(req, res);
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
