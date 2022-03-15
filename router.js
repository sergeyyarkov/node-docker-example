import http from 'node:http';

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

export default new Router();
