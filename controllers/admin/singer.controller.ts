import { Request, Response } from "express";

import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";
import * as pagination from "../../helper/pagination";
import searchHelper from "../../helper/search";

// [GET]/admin/singers
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    const objSearch = searchHelper(req.query);
    if (objSearch["regex"]) {
        find["fullName"] = objSearch["regex"];
    }
    // pagination
    const countSinger = await Singer.countDocuments(find);
    let objPagination = pagination.paganation(
        {
            currentPage: 1,
            limitItems: 5
        },
        req.query,
        countSinger
    );
    // end pagination
    const singers = await Singer.find(find)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);


    res.render("admin/pages/singers/index", {
        pageTitle: "Quản lý ca sĩ",
        singers: singers,
        keyword: objSearch.keyword,
        pagination: objPagination
    });
}

// [GET]/admin/singers/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/singers/create", {
        pageTitle: "Thêm mới ca sĩ"
    });
}

// [POST]/admin/singers/create
export const createPost = async (req: Request, res: Response) => {
    const singer = new Singer(req.body);
    await singer.save();
    req.flash('success', 'Thêm ca sĩ mới thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/singers`)
}

// [GET]/admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
    const id = req.params.id;
    const singer = await Singer.findOne({
        _id: id,
        deleted: false
    });
    res.render("admin/pages/singers/edit", {
        pageTitle: `Chỉnh sửa ${singer.fullName}`,
        singer: singer
    });
}

// [PATCH]/admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const id = req.params.id;
    await Singer.updateOne({
        _id: id,
        deleted: false
    }, req.body);
    req.flash('success', 'Cập nhật ca sĩ thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/singers`)
}

// [PATCH]/admin/singers/edit/:id
export const deleteSinger = async (req: Request, res: Response) => {
    const id = req.params.id;
    await Singer.deleteOne({ _id: id });
    req.flash('success', 'Xóa ca sĩ thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/singers`)
}

// [GET]/admin/singers/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const singer = await Singer.findOne({
        _id: id,
        deleted: false
    });
    res.render("admin/pages/singers/detail", {
        pageTitle: `Xem chi tiết ca sĩ ${singer.fullName}`,
        singer: singer
    });
}

// [PATCH]/admin/singers/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status = req.params.status;
    const id = req.params.id;
    await Singer.updateOne({ _id: id }, { status: status });
    req.flash('success', 'Cập nhật trạng thái thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/singers`)
}