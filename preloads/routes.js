/**
 * Router
 */
import router from '#app/router';

/**
 * Controllers
 */
import ArticleController from '#controllers/ArticleController';
import EditorController from '#app/controllers/EditorController';

/**
 * Middlewares
 */
import WaitMiddleware from '#middlewares/WaitMiddleware';

router.get('/', ArticleController.index).middleware([WaitMiddleware.handle]);
router.get('/articles/:id', ArticleController.show);
router.post('/articles', ArticleController.create);
router.post('/articles/:id', ArticleController.delete);
router.get('/editor/create', EditorController.create);
