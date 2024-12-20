import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helper/convertToSlug";

export const result = async (req: Request, res: Response) => {
    const keyWord: string = `${req.query.keyword}`;

    let newSongs = [];

    if (keyWord) {
        const keywordRegex = new RegExp(keyWord, "i");

        // tạo slug k dấu, có dấu - ngăn cách
        const stringSlug = convertToSlug(keyWord);
        const stringSlugRegex = new RegExp(stringSlug, "i");

        const songs = await Song.find({
            $or: [
                { title: keywordRegex },
                { slug: stringSlugRegex }
            ]
        });

        for (const item of songs) {
            const infoSinger = await Singer.findOne({
                _id: item.singerId
            });
            item["infoSinger"] = infoSinger;
        }
        newSongs = songs;
    }

    res.render("client/page/search/result", {
        pageTitle: `Kết quả: ${keyWord}`,
        keyWord: keyWord,
        songs: newSongs
    });
}