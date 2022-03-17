import http from 'node:http';
import Response from './response.js';

/**
 * This middleware waits for a few milliseconds
 *
 * @param {http.ClientRequest} req
 * @param {Response} res
 * @param {function} next
 */
export const waitMiddleware = async (req, res) => {
  const wait = (ms = 1000) => {
    return new Promise((res) => {
      setTimeout(() => res(ms), ms);
    });
  };

  await wait(10);
};
