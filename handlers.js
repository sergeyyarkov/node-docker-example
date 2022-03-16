import http from 'node:http';
import Response from './response.js';
import db from './db.js';

/**
 * GET - Get list of all artcles from database
 *
 * @param {http.ClientRequest} req
 * @param {Response} res
 */
export const getArticlesHandler = async (req, res) => {
  const data = await db.client.query('SELECT * FROM "articles"');
  res.json({ data: data.rows });
};

/**
 * GET - Get article by ID
 *
 * @param {http.ClientRequest} req
 * @param {Response} res
 */
export const getArticleHandler = async (req, res) => {
  /**
   * Validate url `id` param
   */
  if (!/^\d+$/.test(req.params.id)) {
    res.json({ data: {}, error: 'Parameters is not valid!' }, 422);
    return;
  }

  const data = await db.client.query(
    'SELECT * from "articles" WHERE "id" = $1',
    [req.params.id]
  );

  if (data.rows.length === 0) {
    res.json({ data: {}, error: 'Article not found.' }, 404);
    return;
  }

  res.json({ data: data.rows });
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
