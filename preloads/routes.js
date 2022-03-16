import router from '../router.js';

/**
 * Handlers
 */
import {
  createArticleHandler,
  getArticleHandler,
  getArticlesHandler,
} from '../handlers.js';

/**
 * Middlewares
 */
import { helloMiddleware } from '../middlewares.js';

router.get('/api/articles', getArticlesHandler).middleware([helloMiddleware]);
router.get('/api/article/:id', getArticleHandler).middleware([helloMiddleware]);
router.post('/api/article', createArticleHandler);
