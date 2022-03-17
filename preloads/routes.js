import router from '../router.js';

/**
 * Handlers
 */
import {
  createArticleHandler,
  getArticleHandler,
  indexPageHandler,
} from '../handlers.js';

/**
 * Middlewares
 */
import { waitMiddleware } from '../middlewares.js';

router.get('/', indexPageHandler).middleware([waitMiddleware]);
router.get('/articles/:id', getArticleHandler).middleware([waitMiddleware]);
router.post('/articles', createArticleHandler);
