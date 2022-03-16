import http from 'node:http';
import { pathToRegexp } from 'path-to-regexp';

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
    const mask = `${req.method}:${req.url}`;

    /**
     * Find the exact route
     */
    if (this.routes.hasOwnProperty(mask)) {
      this.routes[mask].handler(req, res);
      return true;
    }

    /**
     * Find route by regular expression
     */
    const keys = Object.keys(this.routes);
    let i = keys.length;

    while (i--) {
      const route = this.routes[keys[i]];
      if (!route.options.exact && route.options.regexp !== undefined) {
        const match = req.url.match(route.options.regexp);
        if (match && keys[i].includes(req.method)) {
          if (route.options.params !== undefined) {
            req.params = {};
            route.options.params.forEach((param) => {
              req.params[param.name] = match[1];
            });
          }
          route.handler(req, res);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Add more routes to router store
   *
   * @param {string} url
   * @param {function} handler
   * @param {boolean} exact
   */
  define(
    method = 'GET',
    url,
    handler,
    options = { exact: true, regexp: undefined, params: undefined }
  ) {
    if (url.includes(':')) {
      options.params = [];
      options.exact = false;
      options.regexp = pathToRegexp(url, options.params);
    }
    this.routes[`${method}:${url}`] = {
      method,
      handler,
      options,
    };
  }
}

export default new Router();
