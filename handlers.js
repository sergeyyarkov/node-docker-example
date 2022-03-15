import http from 'node:http';
import Response from './response.js';

/**
 * Get list of all artcles from database
 *
 * @param {http.ClientRequest} req
 * @param {Response} res
 */
export const getArticlesHandler = async (req, res) => {
  res.json([
    { id: 1, title: 'First artcile' },
    { id: 2, title: 'Second artcile' },
  ]);
};
