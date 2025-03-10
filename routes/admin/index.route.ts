import { Express } from "express";
import { systemConfig } from "../../config/config";

import * as authMiddleware from "../../middlewares/admin/auth.middleware";

import { authRoutes } from "./auth.route";
import { dashboardRoutes } from "./dashboard.route";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { uploadRoutes } from "./upload.route";
import { singerRoutes } from "./singer.route";
import { accountRoutes } from "./account.route";
import { roleRoutes } from "./role.route";
import { userRoutes } from "./user.route";
import * as authController from "../../controllers/admin/auth.controller"

const adminRoutes = (app: Express): void => {
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.get(PATH_ADMIN, authController.login);

    app.use(`${PATH_ADMIN}/auth`, authRoutes);
    app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.requireAuth, dashboardRoutes);
    app.use(`${PATH_ADMIN}/topics`, authMiddleware.requireAuth, topicRoutes);
    app.use(`${PATH_ADMIN}/songs`, authMiddleware.requireAuth, songRoutes);
    app.use(`${PATH_ADMIN}/upload`, authMiddleware.requireAuth, uploadRoutes);
    app.use(`${PATH_ADMIN}/singers`, authMiddleware.requireAuth, singerRoutes);
    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, accountRoutes);
    app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, roleRoutes);
    app.use(`${PATH_ADMIN}/users`, authMiddleware.requireAuth, userRoutes);
};

export default adminRoutes;