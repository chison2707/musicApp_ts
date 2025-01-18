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
exports.editPatch = exports.edit = exports.infor = exports.resetPasswordPost = exports.resetPassword = exports.otpPasswordPost = exports.otpPassword = exports.forgotPassPost = exports.forgotPass = exports.logout = exports.loginPost = exports.registerPost = exports.register = exports.login = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generateHelper = __importStar(require("../../helper/generate"));
const forgot_password_model_1 = __importDefault(require("../../models/forgot-password.model"));
const sendmail_1 = require("../../helper/sendmail");
// [GET]/users/login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/user/login", {
        pageTitle: "Đăng nhập"
    });
});
exports.login = login;
// [GET]/users/register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/user/register", {
        pageTitle: "Đăng ký"
    });
});
exports.register = register;
// [POST]/users/register
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existEmail = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return;
    }
    req.body.password = (0, md5_1.default)(req.body.password);
    const user = new user_model_1.default({
        fullName: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
    });
    yield user.save();
    req.flash("success", "Đăng ký thành công");
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/topics");
});
exports.registerPost = registerPost;
// [POST]/users/login
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    if ((0, md5_1.default)(password) != user.password) {
        req.flash("error", "Mật khẩu không đúng!");
        res.redirect("back");
        return;
    }
    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("/");
        return;
    }
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
});
exports.loginPost = loginPost;
// [GET]/users/logout
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("tokenUser");
    res.redirect(`/`);
});
exports.logout = logout;
// [GET]/users/password/forgot
const forgotPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/user/forgot-password", {
        pageTitle: "Quên mật khẩu"
    });
});
exports.forgotPass = forgotPass;
// [POST]/users/password/forgot
const forgotPassPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    // Tạo mã otp và lưu otp, email vào collection forgot password
    const otp = generateHelper.generateRandomNumber(8);
    const objforgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };
    const forgotPassword = new forgot_password_model_1.default(objforgotPassword);
    yield forgotPassword.save();
    // gửi mã otp qua email của user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP lấy lại mật khẩu là <b>${otp}</b>.Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP
    `;
    (0, sendmail_1.sendMail)(email, subject, html);
    res.redirect(`/users/password/otp?email=${email}`);
});
exports.forgotPassPost = forgotPassPost;
// [GET]/users/password/otp
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    res.render("client/page/user/otp-password", {
        pageTitle: "Nhập mã otp",
        email: email
    });
});
exports.otpPassword = otpPassword;
// [POST]/users/password/otp
const otpPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = yield forgot_password_model_1.default.findOne({
        email: email,
        otp: otp
    });
    if (!result) {
        req.flash("error", "Mã OTP không đúng!");
        res.redirect("back");
        return;
    }
    ;
    const user = yield user_model_1.default.findOne({
        email: email
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect(`/users/password/reset`);
});
exports.otpPasswordPost = otpPasswordPost;
// [GET]/users/password/reset
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu"
    });
});
exports.resetPassword = resetPassword;
// [POST]/users/password/reset
const resetPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    yield user_model_1.default.updateOne({
        tokenUser: tokenUser
    }, {
        password: (0, md5_1.default)(password)
    });
    req.flash("success", "Đổi mật khẩu thành công!!!");
    res.redirect("/");
});
exports.resetPasswordPost = resetPasswordPost;
// [GET]/users/infor
const infor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/user/infor", {
        pageTitle: "Thông tin cá nhân"
    });
});
exports.infor = infor;
// [GET]/users/edit
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/page/user/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    });
});
exports.edit = edit;
// [PATCH]/users/edit
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, phone, password } = req.body;
        const updateData = { fullName, phone };
        if (password) {
            updateData.password = (0, md5_1.default)(password);
        }
        yield user_model_1.default.updateOne({
            tokenUser: req.cookies.tokenUser
        }, updateData);
        req.flash("success", "Đổi thông tin cá nhân thành công!!!");
        res.redirect("/");
    }
    catch (error) {
        req.flash("error", "Đã xảy ra lỗi. Vui lòng thử lại!");
        res.redirect("back");
    }
});
exports.editPatch = editPatch;
