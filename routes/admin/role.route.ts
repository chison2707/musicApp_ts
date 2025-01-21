import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/role.controller";

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', controller.createPost);
router.delete('/delete/:id', controller.deleteRole);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', controller.editPatch);

export const roleRoutes: Router = router;