import { Request, Response } from 'express';
import Topic from '../../models/topic.model';
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';

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


    res.render("client/page/songs/detail", {
        pageTitle: "Trang chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
}