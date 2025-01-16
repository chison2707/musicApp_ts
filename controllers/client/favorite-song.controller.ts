import { Request, Response } from 'express';
import FavoriteSong from '../../models/favorite-song.model';
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';

// [GET]/favorite-songs
export const index = async (req: Request, res: Response) => {
    const favoriteSongs = await FavoriteSong.find({
        userId: res.locals.user.id
    });

    for (const item of favoriteSongs) {
        const infoSong = await Song.findOne({
            _id: item["songId"]
        });

        const infoSinger = await Singer.findOne({
            _id: infoSong["singerId"]
        });
        item["infoSong"] = infoSong;
        item["infoSinger"] = infoSinger;
    }

    res.render("client/page/favorite-songs/index", {
        pageTitle: "Favorite Songs",
        favoriteSongs: favoriteSongs
    });
}