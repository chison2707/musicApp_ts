import { Request, Response } from 'express';
import User from '../../models/user.model';
import md5 from 'md5';

export const login = async (req: Request, res: Response) => {
    res.render("client/page/user/login", {
        pageTitle: "Đăng nhập"
    });
}

export const register = async (req: Request, res: Response) => {
    res.render("client/page/user/register", {
        pageTitle: "Đăng ký"
    });
}

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

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("tokenUser");
    res.redirect(`/topics`);
}