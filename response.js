import http from 'node:http';
import fs from 'node:fs';
import hbs from 'handlebars';
import mime from 'mime-types';
import router from './router.js';
import FileHelper from './helpers/file.js';

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

  send(text, status = 200) {
    this.res.writeHead(status, { 'Content-Type': 'text/plain' });
    this.res.end(text);
  }

  json(data, status = 200) {
    this.res.writeHead(status, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify(data));
  }

  notFound(text) {
    this.send(text, 404);
  }

  /**
   * Response with rendered page
   *
   * @param {string} src Path to static template file
   * @param {object} data Data for the page
   */
  render(src, data, status = 200) {
    try {
      const file = fs.readFileSync(src);
      const template = hbs.compile(file.toString());
      const out = template(data);
      this.res.writeHead(status, { 'Content-Type': 'text/html' });
      this.res.end(out);
    } catch (error) {
      throw error;
    }
  }
}

export default Response;
