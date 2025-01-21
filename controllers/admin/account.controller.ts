import { Request, Response } from "express";
import Account from "../../models/account.model";
import Role from "../../models/role.model";
import * as pagination from "../../helper/pagination";
import { systemConfig } from "../../config/config";
import md5 from "md5";

//[GET] / admin/accounts
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    // pagination
    const countAccount = await Role.countDocuments(find);
    let objPagination = pagination.paganation(
        {
            currentPage: 1,
            limitItems: 5
        },
        req.query,
        countAccount
    );
    // end pagination

    const records = await Account.find(find)
        .select("-password -token")
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);

    for (const record of records) {
        const role = await Role.findOne({
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
}

//[GET] / admin/accounts/create
export const create = async (req: Request, res: Response) => {
    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
}

//[PATCH] / admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
    const emailExists = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if (emailExists) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    } else {
        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();
        req.flash("success", "Tạo tài khoản mới thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
}

//[GET] / admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await Account.findOne({
        _id: id,
        deleted: false
    })
    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        data: data,
        roles: roles
    });
}

//[PATCH] / admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const id = req.params.id;

    const emailExists = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    });

    if (emailExists) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }

        await Account.updateOne({
            _id: id
        }, req.body);

        req.flash("success", "Cập nhật tài khoản thành công");
    }
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

//[GET] / admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await Account.findOne({
        _id: id,
        deleted: false
    }).select("-password -token");
    const role = await Role.findOne({
        _id: data.role_id,
        deleted: false
    });

    res.render("admin/pages/accounts/detail", {
        pageTitle: "Xem chi tiết tài khoản",
        data: data,
        role: role
    });
}

//[DELETE] / admin/accounts/delete/:id
export const deleteAccount = async (req: Request, res: Response) => {
    const id = req.params.id;
    await Account.deleteOne({ _id: id });

    req.flash("success", "Xóa tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}