import { Router } from 'express';
const router: Router = Router();
import * as controller from "../../controllers/client/favorite-song.controller";
import * as authMiddleware from "../../middlewares/client/auth.middleware";

router.get('/', authMiddleware.requireAuth, controller.index);

export const favoriteSongRoutes: Router = router;