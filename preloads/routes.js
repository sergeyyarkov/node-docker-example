import router from '../router.js';

/**
 * Handlers
 */
import { getArticleHandler, getArticlesHandler } from '../handlers.js';

router.define('/api/articles', getArticlesHandler);
router.define('/api/article/:id', getArticleHandler);
