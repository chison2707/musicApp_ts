import { Request, Response } from 'express';
import Topic from '../../models/topic.model';
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';
import FavoriteSong from '../../models/favorite-song.model';

// [GET]/topics
export const list = async (req: Request, res: Response) => {
    const topic = await Topic.findOne({
        slug: req.params.slugTopic,
        status: "active",
        deleted: false
    });
    const songs = await Song.find({
        topicId: topic.id,
        status: "active",
        deleted: false
    }).select("avatar title slug singerId like");

    for (const song of songs) {
        const inforSinger = await Singer.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        });

        song["inforSinger"] = inforSinger
    }

    res.render("client/page/songs/list", {
        pageTitle: topic.title,
        songs: songs
    });
}

export const detail = async (req: Request, res: Response) => {
    const slugSong: String = req.params.slugSong;
    const song = await Song.findOne({
        slug: slugSong,
        status: "active",
        deleted: false
    });

    const singer = await Singer.findOne({
        _id: song.singerId,
        status: "active",
        deleted: false
    }).select("fullName");

    const topic = await Topic.findOne({
        _id: song.topicId,
        status: "active",
        deleted: false
    }).select("title");

    const favoriteSong = await FavoriteSong.findOne({
        songId: song.id
    });

    song["isFavoriteSong"] = favoriteSong ? true : false;

    res.render("client/page/songs/detail", {
        pageTitle: "Trang chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
}

// [PATCH]/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
    const idSong: string = req.params.idSong;
    const typeLike: string = req.params.typeLike;

    const song = await Song.findOne({
        _id: idSong,
        status: "active",
        deleted: false
    });

    const newLike: number = typeLike == "like" ? song.like + 1 : song.like - 1;
    await Song.updateOne({
        _id: idSong
    }, {
        like: newLike
    });

    res.json({
        code: 200,
        message: "Thành công",
        like: newLike
    })
}

// [PATCH]/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
    const idSong: string = req.params.idSong;
    const typeFavorite: string = req.params.typeFavorite;

    switch (typeFavorite) {
        case "favorite":
            const existFavorite = await FavoriteSong.findOne({
                songId: idSong
            });
            if (!existFavorite) {
                const record = new FavoriteSong({
                    // userId:"",
                    songId: idSong
                });
                await record.save();
            }
            break;
        case "unfavorite":
            await FavoriteSong.deleteOne({
                songId: idSong
            });
            break;
        default:
            break;
    }

    res.json({
        code: 200,
        message: "Thành công"
    });
}

// [PATCH]/listen/:idSong
export const listen = async (req: Request, res: Response) => {
    const idSong: string = req.params.idSong;

    const song = await Song.findOne({
        _id: idSong,
        status: "active",
        deleted: false
    });
    const listen: number = song.listen + 1;
    await Song.updateOne({
        _id: idSong
    }, {
        listen: listen
    });

    const songNew = await Song.findOne({
        _id: idSong
    });

    res.json({
        code: 200,
        message: "Thành công",
        listen: songNew.listen
    });
}