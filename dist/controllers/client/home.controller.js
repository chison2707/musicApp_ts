"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
// [GET]/favorite-songs
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   lấy ra bài hát nhiều like nhất
    const songLikes = yield song_model_1.default.find({
        deleted: false,
    }).sort({ like: "desc" }).limit(10);
    for (const song of songLikes) {
        const inforSinger = yield singer_model_1.default.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        });
        song["inforSinger"] = inforSinger;
    }
    res.render("client/page/home/index", {
        pageTitle: "Favorite Songs",
        songLikes: songLikes
    });
});
exports.index = index;
