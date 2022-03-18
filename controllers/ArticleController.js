import http from 'node:http';
import fs from 'node:fs';
import Response from '#app/Response';

/**
 * Models
 */
import ArticleModel from '#models/ArticleModel';

class ArticleController {
  /**
   * Render page with list of articles
   *
   * @param {http.ClientRequest} req
   * @param {Response} res
   */
  static async index(req, res) {
    try {
      const info = fs.readFileSync('./package.json', 'utf8');
      const appInfo = JSON.parse(info.toString());
      const articles = await ArticleModel.getAll();

      res.render('./views/index.hbs', {
        title: appInfo.name,
        articles,
      });
    } catch (error) {
      res.serverError(error);
    }
  }

  /**
   * Render page with single article by `id`
   *
   * @param {http.ClientRequest} req
   * @param {Response} res
   */
  static async show(req, res) {
    try {
      /**
       * Validate url `id` param
       */
      const id = req.params.id;
      if (!/^\d+$/.test(id)) {
        res.render(
          './views/404.hbs',
          { title: '404 | Article not found.' },
          404
        );
        return;
      }

      const article = await ArticleModel.getById(id);

      /**
       * Not found
       */
      if (!article) {
        res.render(
          './views/404.hbs',
          { title: '404 | Article not found.' },
          404
        );
        return;
      }

      res.render('./views/article.hbs', {
        title: article.title,
        article,
      });
    } catch (error) {
      res.serverError(error);
    }
  }

  /**
   * Create new article
   *
   * @param {http.ClientRequest} req
   * @param {Response} res
   */
  static async create(req, res) {
    try {
      const data = req.getPostData();
      if (data && data.title && data.description && data.body) {
        const article = await ArticleModel.create({
          title: data.title,
          description: data.description,
          body: data.body,
        });
        res.redirect(`/articles/${article.id}`);
      }
    } catch (error) {
      res.serverError(error);
    }
  }
}

export default ArticleController;
