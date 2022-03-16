import router from '../router.js';

/**
 * Handlers
 */
import {
  createArticleHandler,
  getArticleHandler,
  getArticlesHandler,
} from '../handlers.js';

router.define('GET', '/api/articles', getArticlesHandler);
router.define('GET', '/api/article/:id', getArticleHandler);
router.define('POST', '/api/article', createArticleHandler);
