import { Request, Response } from "express";
import Role from "../../models/role.model";
import * as pagination from "../../helper/pagination";
import { systemConfig } from "../../config/config";

//[GET] / admin/roles
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    // pagination
    const countRole = await Role.countDocuments(find);
    let objPagination = pagination.paganation(
        {
            currentPage: 1,
            limitItems: 5
        },
        req.query,
        countRole
    );
    // end pagination

    const records = await Role.find(find)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);

    res.render("admin/pages/roles/index", {
        pageTitle: "Danh sách nhóm quyền",
        records: records,
        pagination: objPagination
    });
}

//[GET] / admin/roles/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Danh sách nhóm quyền"
    });
}

//[ PATCH] / admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    const data = new Role(req.body)
    await data.save();
    req.flash('success', 'Thêm nhóm quyền mới thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

//[ DELETE] / admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
    const id = req.params.id;
    await Role.deleteOne({ _id: id });
    req.flash('success', 'Xóa nhóm quyền thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

//[GET] / admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
    const id = req.params.id;
    const record = await Role.findOne({ _id: id });
    res.render("admin/pages/roles/edit", {
        pageTitle: "Chỉnh sửa nhóm quyền",
        record: record
    });
}

//[PATCH] / admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    req.flash('success', 'Cập nhật nhóm quyền thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

//[GET] / admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    const records = await Role.find(find);
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records,
    });
}

//[Patch] / admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {

    try {
        const permissions = JSON.parse(req.body.permissions);

        for (const item of permissions) {
            await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
        }

        req.flash('success', `Cập nhật phân quyền thành công!`);
    } catch (error) {
        req.flash('error', `Cập nhật phân quyền thất bại!`);

    }

    res.redirect("back");
}

//[GET] / admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
    const record = await Role.findOne({ _id: req.params.id });
    res.render("admin/pages/roles/detail", {
        pageTitle: `Chi tiết ${record.title}`,
        record: record,
    });
}