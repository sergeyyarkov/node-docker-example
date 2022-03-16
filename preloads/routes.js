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
import { waitMiddleware } from '../middlewares.js';

router.get('/api/articles', getArticlesHandler).middleware([waitMiddleware]);
router.get('/api/articles/:id', getArticleHandler).middleware([waitMiddleware]);
router.post('/api/article', createArticleHandler);
