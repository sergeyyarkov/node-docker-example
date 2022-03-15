import router from '../router.js';

/**
 * Handlers
 */
import { getArticlesHandler } from '../handlers.js';

router.define('/api/articles', getArticlesHandler);
