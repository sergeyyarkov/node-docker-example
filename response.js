import http from 'node:http';

class Response {
  /**
   * Extends the http response object with this class
   * @param {http.ClientRequest} req
   * @param {http.ServerResponse} res
   */
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  send(text) {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' });
    this.res.end(text);
  }

  json(data, status = 200) {
    this.res.writeHead(status, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify(data));
  }

  notFound(data) {
    this.json(data, 404);
  }
}

export default Response;
