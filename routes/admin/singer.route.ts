import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/singer.controller";
import * as uploadCould from "../../middlewares/admin/uploadCloud.middleware";
import * as singerValidate from "../../validates/admin/singer.validate";
import multer from "multer";
const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", upload.single("avatar"), uploadCould.uploadSingle, singerValidate.createPost, controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single("avatar"), uploadCould.uploadSingle, singerValidate.createPost, controller.editPatch);
router.delete("/delete/:id", controller.deleteSinger);
router.get("/detail/:id", controller.detail);
router.patch("/change-status/:status/:id", controller.changeStatus);

export const singerRoutes: Router = router;