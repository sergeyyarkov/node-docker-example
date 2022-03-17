import http from 'node:http';
import fs from 'node:fs';
import Response from './response.js';
import db from './db.js';

/**
 * Render index page
 *
 * @param {http.ClientRequest} req
 * @param {Response} res
 */
export const indexPageHandler = async (req, res) => {
  try {
    const info = fs.readFileSync('./package.json', 'utf8');
    const appInfo = JSON.parse(info.toString());
    const data = await db.client.query('SELECT * FROM "articles"');

    res.render('./views/index.hbs', {
      title: appInfo.name,
      articles: data.rows,
    });
  } catch (error) {
    console.error(error);
    res.render(
      './views/500.hbs',
      { title: '500 | Internal server error ' },
      500
    );
  }
};

/**
 * GET - Get article by ID
 *
 * @param {http.ClientRequest} req
 * @param {Response} res
 */
export const getArticleHandler = async (req, res) => {
  try {
    /**
     * Validate url `id` param
     */
    if (!/^\d+$/.test(req.params.id)) {
      res.render('./views/404.hbs', { title: '404 | Article not found.' }, 404);
      return;
    }

    const data = await db.client.query(
      'SELECT * from "articles" WHERE "id" = $1',
      [req.params.id]
    );

    if (data.rows.length === 0) {
      res.render('./views/404.hbs', { title: '404 | Article not found.' }, 404);
      return;
    }

    res.render('./views/article.hbs', {
      title: data.rows[0].title,
      article: data.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.render(
      './views/500.hbs',
      { title: '500 | Internal server error ' },
      500
    );
  }
};

/**
 * POST - Create article
 *
 * @param {http.ClientRequest} req
 * @param {Response} res
 */
export const createArticleHandler = async (req, res) => {
  res.json({ data: `POST ${req.url}` });
  return;
};
