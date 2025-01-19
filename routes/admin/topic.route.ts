import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/topic.controller";
import * as uploadCould from "../../middlewares/admin/uploadCloud.middleware";
import * as topicValidate from "../../validates/admin/topic.validate";
import multer from "multer";
const upload = multer();

router.get("/", controller.index);
router.get("/detail/:idTopic", controller.detail);
router.get("/edit/:idTopic", controller.edit);
router.patch("/edit/:idTopic", upload.single("avatar"), uploadCould.uploadSingle, topicValidate.createPost, controller.editPatch);
router.get("/create", controller.create);
router.post("/create", upload.single("avatar"), uploadCould.uploadSingle, topicValidate.createPost, controller.createPost);
router.delete("/delete/:idTopic", controller.deleteTopic);
router.patch("/change-status/:status/:idTopic", controller.changeStatus);

export const topicRoutes: Router = router;