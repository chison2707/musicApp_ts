import { NextFunction, Request, Response } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ và tên!');
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect("back");
        return;
    }
    if (!req.body.status) {
        req.flash('error', 'Vui lòng chọn active!');
        res.redirect("back");
        return;
    }
    next();
}

export const editPatch = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ và tên!');
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect("back");
        return;
    }
    if (!req.body.status) {
        req.flash('error', 'Vui lòng chọn active!');
        res.redirect("back");
        return;
    }
    next();
}
