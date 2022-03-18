import http from 'node:http';
import Response from '#app/Response';

class EditorController {
  /**
   * Render editor for creating article
   *
   * @param {http.ClientRequest} req
   * @param {Response} res
   */
  static create(req, res) {
    try {
      res.render('./views/editor/create.hbs', { title: 'Create new article' });
    } catch (error) {
      res.serverError(error);
    }
  }
}

export default EditorController;
