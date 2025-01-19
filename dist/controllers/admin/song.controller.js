"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.detail = exports.deleteSong = exports.changeStatus = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const config_1 = require("../../config/config");
const pagination = __importStar(require("../../helper/pagination"));
const search_1 = __importDefault(require("../../helper/search"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const objSearch = (0, search_1.default)(req.query);
    if (objSearch["regex"]) {
        find["title"] = objSearch["regex"];
    }
    // pagination
    const countSong = yield song_model_1.default.countDocuments(find);
    let objPagination = pagination.paganation({
        currentPage: 1,
        limitItems: 5
    }, req.query, countSong);
    // end pagination
    const songs = yield song_model_1.default.find(find)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);
    res.render("admin/pages/songs/index", {
        pageTitle: "Quản lý bài hát",
        songs: songs,
        keyword: objSearch.keyword,
        pagination: objPagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        deleted: false
    }).select("title");
    const singers = yield singer_model_1.default.find({
        deleted: false
    }).select("fullName");
    res.render("admin/pages/songs/create", {
        pageTitle: "Thêm mới bài hát",
        topics: topics,
        singers: singers
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let avatar = "";
    let audio = "";
    if (req.body.avatar) {
        avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        audio = req.body.audio[0];
    }
    const datasong = {
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        lyrics: req.body.lyrics,
        status: req.body.status,
        avatar: avatar,
        audio: audio
    };
    const song = new song_model_1.default(datasong);
    yield song.save();
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
});
exports.createPost = createPost;
// [GET]/songs/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const song = yield song_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    const topics = yield topic_model_1.default.find({
        deleted: false
    }).select("title");
    const singers = yield singer_model_1.default.find({
        deleted: false
    }).select("fullName");
    res.render("admin/pages/songs/edit", {
        pageTitle: "Chỉnh sửa bài hát",
        song: song,
        topics: topics,
        singers: singers
    });
});
exports.edit = edit;
// [PATCH]/songs/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let avatar = "";
    let audio = "";
    const datasong = {
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        lyrics: req.body.lyrics,
        status: req.body.status
    };
    if (req.body.avatar) {
        datasong["avatar"] = req.body.avatar[0];
    }
    if (req.body.audio) {
        datasong["audio"] = req.body.audio[0];
    }
    yield song_model_1.default.updateOne({
        _id: id
    }, datasong);
    res.redirect("back");
});
exports.editPatch = editPatch;
// [PATCH]/songs/change-status/:status/:id
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const status = req.params.status;
    yield song_model_1.default.updateOne({
        _id: id
    }, {
        status: status
    });
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect("back");
});
exports.changeStatus = changeStatus;
// [DELETE]/songs/delete/:id
const deleteSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield song_model_1.default.deleteOne({
        _id: id
    });
    req.flash("success", "Xóa bài hát thành công");
    res.redirect("back");
});
exports.deleteSong = deleteSong;
// [DELETE]/songs/detail/:id
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const song = yield song_model_1.default.findOne({
        _id: id
    });
    const topic = yield topic_model_1.default.findOne({
        _id: song.topicId
    }).select("title");
    const singer = yield singer_model_1.default.findOne({
        _id: song.singerId
    }).select("fullName");
    song["topic"] = topic.title;
    song["singer"] = singer.fullName;
    res.render("admin/pages/songs/detail", {
        pageTitle: `${song.title}`,
        song: song
    });
});
exports.detail = detail;
