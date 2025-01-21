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
exports.deleteAccount = exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const account_model_1 = __importDefault(require("../../models/account.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const pagination = __importStar(require("../../helper/pagination"));
const config_1 = require("../../config/config");
const md5_1 = __importDefault(require("md5"));
//[GET] / admin/accounts
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    // pagination
    const countAccount = yield role_model_1.default.countDocuments(find);
    let objPagination = pagination.paganation({
        currentPage: 1,
        limitItems: 5
    }, req.query, countAccount);
    // end pagination
    const records = yield account_model_1.default.find(find)
        .select("-password -token")
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);
    for (const record of records) {
        const role = yield role_model_1.default.findOne({
            _id: record.role_id,
            deleted: false
        });
        record["role"] = role;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản admin",
        records: records,
        pagination: objPagination
    });
});
exports.index = index;
//[GET] / admin/accounts/create
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield role_model_1.default.find({ deleted: false });
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
});
exports.create = create;
//[PATCH] / admin/accounts/create
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExists = yield account_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (emailExists) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    }
    else {
        req.body.password = (0, md5_1.default)(req.body.password);
        const record = new account_model_1.default(req.body);
        yield record.save();
        req.flash("success", "Tạo tài khoản mới thành công");
        res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.createPost = createPost;
//[GET] / admin/accounts/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = yield account_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    const roles = yield role_model_1.default.find({ deleted: false });
    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        data: data,
        roles: roles
    });
});
exports.edit = edit;
//[PATCH] / admin/accounts/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const emailExists = yield account_model_1.default.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    });
    if (emailExists) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
    }
    else {
        if (req.body.password) {
            req.body.password = (0, md5_1.default)(req.body.password);
        }
        else {
            delete req.body.password;
        }
        yield account_model_1.default.updateOne({
            _id: id
        }, req.body);
        req.flash("success", "Cập nhật tài khoản thành công");
    }
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
});
exports.editPatch = editPatch;
//[GET] / admin/accounts/detail/:id
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = yield account_model_1.default.findOne({
        _id: id,
        deleted: false
    }).select("-password -token");
    const role = yield role_model_1.default.findOne({
        _id: data.role_id,
        deleted: false
    });
    res.render("admin/pages/accounts/detail", {
        pageTitle: "Xem chi tiết tài khoản",
        data: data,
        role: role
    });
});
exports.detail = detail;
//[DELETE] / admin/accounts/delete/:id
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield account_model_1.default.deleteOne({ _id: id });
    req.flash("success", "Xóa tài khoản thành công");
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/accounts`);
});
exports.deleteAccount = deleteAccount;
