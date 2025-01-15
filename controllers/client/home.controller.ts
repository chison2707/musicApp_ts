import { Request, Response } from 'express';
import FavoriteSong from '../../models/favorite-song.model';
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';

// [GET]/favorite-songs
export const index = async (req: Request, res: Response) => {
    //   lấy ra 10 bài hát nhiều like nhất
    const songLikes = await Song.find({
        deleted: false,
    }).sort({ like: "desc" }).limit(10);

    for (const song of songLikes) {
        const inforSinger = await Singer.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        });

        song["inforSinger"] = inforSinger
    }

    //   lấy ra 10 bài hát nhiều like nhất
    const songListens = await Song.find({
        deleted: false,
    }).sort({ listen: "desc" }).limit(10);

    for (const song of songListens) {
        const inforSinger = await Singer.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        });

        song["inforSinger"] = inforSinger
    }

    res.render("client/page/home/index", {
        pageTitle: "Trang chủ",
        songLikes: songLikes,
        songListens: songListens
    });
}