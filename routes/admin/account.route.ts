import { Router } from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/admin/account.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import * as accountValidate from "../../validates/admin/account.validate";

const upload = multer();

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', upload.single("avatar"), uploadCloud.uploadSingle, accountValidate.createPost, controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', upload.single("avatar"), uploadCloud.uploadSingle, accountValidate.editPatch, controller.editPatch);
router.get('/detail/:id', controller.detail);
router.delete('/delete/:id', controller.deleteAccount);
router.patch('/change-status/:status/:id', controller.changeStatus);

export const accountRoutes: Router = router;