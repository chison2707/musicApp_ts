import { Request, Response } from 'express';
import User from '../../models/user.model';
import md5 from 'md5';
import * as generateHelper from "../../helper/generate";
import ForgorPassword from '../../models/forgot-password.model';
import { sendMail } from '../../helper/sendmail';

// [GET]/users/login
export const login = async (req: Request, res: Response) => {
    res.render("client/page/user/login", {
        pageTitle: "Đăng nhập"
    });
}

// [GET]/users/register
export const register = async (req: Request, res: Response) => {
    res.render("client/page/user/register", {
        pageTitle: "Đăng ký"
    });
}

// [POST]/users/register
export const registerPost = async (req: Request, res: Response) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User({
        fullName: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
    });
    await user.save();

    req.flash("success", "Đăng ký thành công");
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/topics");
}

// [POST]/users/login
export const loginPost = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    if (md5(password) != user.password) {
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
}

// [GET]/users/logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie("tokenUser");
    res.redirect(`/`);
}

// [GET]/users/password/forgot
export const forgotPass = async (req: Request, res: Response) => {
    res.render("client/page/user/forgot-password", {
        pageTitle: "Quên mật khẩu"
    });
}

// [POST]/users/password/forgot
export const forgotPassPost = async (req: Request, res: Response) => {
    const email = req.body.email;

    const user = await User.findOne({
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

    const forgotPassword = new ForgorPassword(objforgotPassword);
    await forgotPassword.save();

    // gửi mã otp qua email của user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP lấy lại mật khẩu là <b>${otp}</b>.Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP
    `;

    sendMail(email, subject, html);
    res.redirect(`/users/password/otp?email=${email}`);
}

// [GET]/users/password/otp
export const otpPassword = async (req: Request, res: Response) => {
    const email = req.query.email;

    res.render("client/page/user/otp-password", {
        pageTitle: "Nhập mã otp",
        email: email
    });
}

// [POST]/users/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgorPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        req.flash("error", "Mã OTP không đúng!");
        res.redirect("back");
        return;
    };
    const user = await User.findOne({
        email: email
    })

    res.cookie("tokenUser", user.tokenUser);

    res.redirect(`/users/password/reset`);
}

// [GET]/users/password/reset
export const resetPassword = async (req: Request, res: Response) => {
    res.render("client/page/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu"
    });
}

// [POST]/users/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    });

    req.flash("success", "Đổi mật khẩu thành công!!!");
    res.redirect("/");
}

// [GET]/users/infor
export const infor = async (req: Request, res: Response) => {
    res.render("client/page/user/infor", {
        pageTitle: "Thông tin cá nhân"
    });
}

// [GET]/users/edit
export const edit = async (req: Request, res: Response) => {
    res.render("client/page/user/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    });
}

// [PATCH]/users/edit
export const editPatch = async (req: Request, res: Response) => {
    try {
        const { fullName, phone, password } = req.body;
        const updateData: any = { fullName, phone };

        if (password) {
            updateData.password = md5(password);
        }

        await User.updateOne({
            tokenUser: req.cookies.tokenUser
        },
            updateData
        );

        req.flash("success", "Đổi thông tin cá nhân thành công!!!");
        res.redirect("/");
    } catch (error) {
        req.flash("error", "Đã xảy ra lỗi. Vui lòng thử lại!");
        res.redirect("back");
    }
};
