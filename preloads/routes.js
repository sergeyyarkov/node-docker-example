import router from '../router.js';

/**
 * Handlers
 */
import {
  createArticleHandler,
  getArticleHandler,
  getArticlesHandler,
  indexPageHandler,
} from '../handlers.js';

/**
 * Middlewares
 */
import { waitMiddleware } from '../middlewares.js';

router.get('/', indexPageHandler);
router.get('/articles', getArticlesHandler).middleware([waitMiddleware]);
router.get('/articles/:id', getArticleHandler).middleware([waitMiddleware]);
router.post('/articles', createArticleHandler);
