import http from 'node:http';
import Response from './response.js';

/**
 * This middleware just prints text to console
 *
 * @param {http.ClientRequest} req
 * @param {Response} res
 * @param {function} next
 */
export const helloMiddleware = (req, res) => {
  console.log('[LOG]: Hello from `helloMiddleware` function');
};
