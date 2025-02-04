import { Request, Response } from "express";
import * as pagination from "../../helper/pagination";
import { systemConfig } from "../../config/config";
import md5 from "md5";
import User from "../../models/user.model";

//[GET] / admin/users
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    // pagination
    const countAccount = await User.countDocuments(find);
    let objPagination = pagination.paganation(
        {
            currentPage: 1,
            limitItems: 5
        },
        req.query,
        countAccount
    );
    // end pagination

    const records = await User.find(find)
        .select("-password -tokenUser")
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);

    res.render("admin/pages/users/index", {
        pageTitle: "Danh sách tài khoản user",
        records: records,
        pagination: objPagination
    });
}

//[GET] / admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
    const data = await User.findOne({ _id: req.params.id });

    res.render("admin/pages/users/detail", {
        pageTitle: "Danh sách tài khoản user",
        data: data
    });
}

//[PATCH] / admin/users/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status = req.params.status;
    await User.updateOne({ _id: req.params.id }, { status: status });

    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/users`);
}

//[DELETE] / admin/users//delete/:id
export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    await User.deleteOne({ _id: id });

    req.flash("success", "Xóa tài khoản thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/users`);
}