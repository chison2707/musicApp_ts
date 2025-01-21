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
exports.editPatch = exports.edit = exports.deleteRole = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../models/role.model"));
const pagination = __importStar(require("../../helper/pagination"));
const config_1 = require("../../config/config");
//[GET] / admin/roles
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    // pagination
    const countRole = yield role_model_1.default.countDocuments(find);
    let objPagination = pagination.paganation({
        currentPage: 1,
        limitItems: 5
    }, req.query, countRole);
    // end pagination
    const records = yield role_model_1.default.find(find)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);
    res.render("admin/pages/roles/index", {
        pageTitle: "Danh sách nhóm quyền",
        records: records,
        pagination: objPagination
    });
});
exports.index = index;
//[GET] / admin/roles/create
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/roles/create", {
        pageTitle: "Danh sách nhóm quyền"
    });
});
exports.create = create;
//[ PATCH] / admin/roles/create
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = new role_model_1.default(req.body);
    yield data.save();
    req.flash('success', 'Thêm nhóm quyền mới thành công');
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
});
exports.createPost = createPost;
//[ DELETE] / admin/roles/delete/:id
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield role_model_1.default.deleteOne({ _id: id });
    req.flash('success', 'Xóa nhóm quyền thành công');
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
});
exports.deleteRole = deleteRole;
//[GET] / admin/roles/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const record = yield role_model_1.default.findOne({ _id: id });
    res.render("admin/pages/roles/edit", {
        pageTitle: "Chỉnh sửa nhóm quyền",
        record: record
    });
});
exports.edit = edit;
//[PATCH] / admin/roles/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield role_model_1.default.updateOne({ _id: id }, req.body);
    req.flash('success', 'Cập nhật nhóm quyền thành công');
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/roles`);
});
exports.editPatch = editPatch;
