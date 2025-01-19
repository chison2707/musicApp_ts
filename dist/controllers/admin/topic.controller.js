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
exports.changeStatus = exports.deleteTopic = exports.createPost = exports.create = exports.editPatch = exports.edit = exports.detail = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const config_1 = require("../../config/config");
const pagination = __importStar(require("../../helper/pagination"));
const search_1 = __importDefault(require("../../helper/search"));
// [GET]/admin/topics
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const objSearch = (0, search_1.default)(req.query);
    if (objSearch["regex"]) {
        find["title"] = objSearch["regex"];
    }
    // pagination
    const countTopics = yield topic_model_1.default.countDocuments(find);
    let objPagination = pagination.paganation({
        currentPage: 1,
        limitItems: 5
    }, req.query, countTopics);
    // end pagination
    const topics = yield topic_model_1.default.find(find)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);
    res.render("admin/pages/topics/index", {
        pageTitle: "Quản lý chủ đề",
        topics: topics,
        keyword: objSearch.keyword,
        pagination: objPagination
    });
});
exports.index = index;
// [GET]/admin/topics/detail/:idTopic
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idTopic = req.params.idTopic;
    const topic = yield topic_model_1.default.findOne({
        _id: idTopic,
        deleted: false
    });
    res.render("admin/pages/topics/detail", {
        pageTitle: `Chủ đề: ${topic.title}`,
        topic: topic
    });
});
exports.detail = detail;
// [GET]/admin/topics/edit/:idTopic
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idTopic = req.params.idTopic;
    const topic = yield topic_model_1.default.findOne({
        _id: idTopic,
        deleted: false
    });
    res.render("admin/pages/topics/edit", {
        pageTitle: `Chỉnh sửa: ${topic.title}`,
        topic: topic
    });
});
exports.edit = edit;
// [PATCH]/admin/topics/edit/:idTopic
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idTopic = req.params.idTopic;
    try {
        const { title, description, avatar, status } = req.body;
        const updateData = { title, description, status };
        if (avatar) {
            updateData.avatar = avatar;
        }
        yield topic_model_1.default.updateOne({
            _id: idTopic,
            deleted: false
        }, updateData);
        req.flash('success', `Cập nhật thành công!`);
    }
    catch (error) {
        req.flash('error', `Cập nhật thất bại!`);
    }
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
});
exports.editPatch = editPatch;
// [GET]/admin/topics/create
const create = (req, res) => {
    res.render("admin/pages/topics/create", {
        pageTitle: "Thêm chủ đề bài hát"
    });
};
exports.create = create;
// [POST]/admin/topics/create
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = new topic_model_1.default(req.body);
    yield record.save();
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
});
exports.createPost = createPost;
// [DELETE]/admin/topics/delete
const deleteTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idTopic = req.params.idTopic;
    yield topic_model_1.default.deleteOne({
        _id: idTopic,
        deleted: false
    });
    req.flash('success', `Xóa thành công!`);
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/topics`);
});
exports.deleteTopic = deleteTopic;
// [PATCH]/admin/topics/change-status/:status/:idTopic
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.idTopic;
    yield topic_model_1.default.updateOne({ _id: id }, {
        status: status
    });
    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
    res.redirect("back");
});
exports.changeStatus = changeStatus;
