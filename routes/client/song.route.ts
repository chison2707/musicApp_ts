import { Router } from 'express';
const router: Router = Router();
import * as controller from "../../controllers/client/song.controller";
import * as authMiddleware from "../../middlewares/client/auth.middleware";

router.get('/:slugTopic', controller.list);
router.get('/detail/:slugSong', controller.detail);
router.patch('/like/:typeLike/:idSong', controller.like);
router.patch('/favorite/:typeFavorite/:idSong', authMiddleware.requireAuth, controller.favorite);
router.patch('/listen/:idSong', controller.listen);

export const songRoutes: Router = router;