import { Express } from "express";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { userRoutes } from "./user.route";
import { favoriteSongRoutes } from "./favorite-song.route";
import { searchRoutes } from "./search.route";
import { homeRoutes } from "./home.route";

import * as userMiddleware from "../../middlewares/use.middleware";

const clientRoutes = (app: Express): void => {
    app.use(userMiddleware.infoUser);

    app.use('/', homeRoutes);
    app.use('/topics', topicRoutes);
    app.use('/songs', songRoutes);
    app.use('/users', userRoutes);
    app.use('/favorite-songs', favoriteSongRoutes);
    app.use('/search', searchRoutes);
}

export default clientRoutes;