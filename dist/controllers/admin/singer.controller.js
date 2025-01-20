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
exports.changeStatus = exports.detail = exports.deleteSinger = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const config_1 = require("../../config/config");
const pagination = __importStar(require("../../helper/pagination"));
const search_1 = __importDefault(require("../../helper/search"));
// [GET]/admin/singers
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const objSearch = (0, search_1.default)(req.query);
    if (objSearch["regex"]) {
        find["fullName"] = objSearch["regex"];
    }
    // pagination
    const countSinger = yield singer_model_1.default.countDocuments(find);
    let objPagination = pagination.paganation({
        currentPage: 1,
        limitItems: 5
    }, req.query, countSinger);
    // end pagination
    const singers = yield singer_model_1.default.find(find)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);
    res.render("admin/pages/singers/index", {
        pageTitle: "Quản lý ca sĩ",
        singers: singers,
        keyword: objSearch.keyword,
        pagination: objPagination
    });
});
exports.index = index;
// [GET]/admin/singers/create
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/singers/create", {
        pageTitle: "Thêm mới ca sĩ"
    });
});
exports.create = create;
// [POST]/admin/singers/create
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singer = new singer_model_1.default(req.body);
    yield singer.save();
    req.flash('success', 'Thêm ca sĩ mới thành công');
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
});
exports.createPost = createPost;
// [GET]/admin/singers/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const singer = yield singer_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    res.render("admin/pages/singers/edit", {
        pageTitle: `Chỉnh sửa ${singer.fullName}`,
        singer: singer
    });
});
exports.edit = edit;
// [PATCH]/admin/singers/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield singer_model_1.default.updateOne({
        _id: id,
        deleted: false
    }, req.body);
    req.flash('success', 'Cập nhật ca sĩ thành công');
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
});
exports.editPatch = editPatch;
// [PATCH]/admin/singers/edit/:id
const deleteSinger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield singer_model_1.default.deleteOne({ _id: id });
    req.flash('success', 'Xóa ca sĩ thành công');
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
});
exports.deleteSinger = deleteSinger;
// [GET]/admin/singers/detail/:id
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const singer = yield singer_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    res.render("admin/pages/singers/detail", {
        pageTitle: `Xem chi tiết ca sĩ ${singer.fullName}`,
        singer: singer
    });
});
exports.detail = detail;
// [PATCH]/admin/singers/change-status/:status/:id
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    yield singer_model_1.default.updateOne({ _id: id }, { status: status });
    req.flash('success', 'Cập nhật trạng thái thành công');
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/singers`);
});
exports.changeStatus = changeStatus;
