import { Request, Response } from 'express';
import Topic from '../../models/topic.model';
import { systemConfig } from '../../config/config';
import * as pagination from "../../helper/pagination";
import searchHelper from '../../helper/search';

// [GET]/admin/topics
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    const objSearch = searchHelper(req.query);
    if (objSearch["regex"]) {
        find["title"] = objSearch["regex"];
    }

    // pagination
    const countTopics = await Topic.countDocuments(find);
    let objPagination = pagination.paganation(
        {
            currentPage: 1,
            limitItems: 5
        },
        req.query,
        countTopics
    );
    // end pagination


    const topics = await Topic.find(find)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);

    res.render("admin/pages/topics/index", {
        pageTitle: "Quản lý chủ đề",
        topics: topics,
        keyword: objSearch.keyword,
        pagination: objPagination
    });
}

// [GET]/admin/topics/detail/:idTopic
export const detail = async (req: Request, res: Response) => {
    const idTopic = req.params.idTopic;
    const topic = await Topic.findOne({
        _id: idTopic,
        deleted: false
    });

    res.render("admin/pages/topics/detail", {
        pageTitle: `Chủ đề: ${topic.title}`,
        topic: topic
    });
}

// [GET]/admin/topics/edit/:idTopic
export const edit = async (req: Request, res: Response) => {
    const idTopic = req.params.idTopic;
    const topic = await Topic.findOne({
        _id: idTopic,
        deleted: false
    });

    res.render("admin/pages/topics/edit", {
        pageTitle: `Chỉnh sửa: ${topic.title}`,
        topic: topic
    });
}

// [PATCH]/admin/topics/edit/:idTopic
export const editPatch = async (req: Request, res: Response) => {
    const idTopic = req.params.idTopic;

    try {
        const { title, description, avatar, status } = req.body;
        const updateData: any = { title, description, status };

        if (avatar) {
            updateData.avatar = avatar;
        }
        await Topic.updateOne({
            _id: idTopic,
            deleted: false
        }, updateData);
        req.flash('success', `Cập nhật thành công!`);
    } catch (error) {
        req.flash('error', `Cập nhật thất bại!`);
    }
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
}

// [GET]/admin/topics/create
export const create = (req: Request, res: Response) => {
    res.render("admin/pages/topics/create", {
        pageTitle: "Thêm chủ đề bài hát"
    });
}

// [POST]/admin/topics/create
export const createPost = async (req: Request, res: Response) => {
    const record = new Topic(req.body);
    await record.save();
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
}

// [DELETE]/admin/topics/delete
export const deleteTopic = async (req: Request, res: Response) => {
    const idTopic = req.params.idTopic;
    await Topic.deleteOne({
        _id: idTopic,
        deleted: false
    });
    req.flash('success', `Xóa thành công!`);
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
}

// [PATCH]/admin/topics/change-status/:status/:idTopic
export const changeStatus = async (req: Request, res: Response) => {
    const status = req.params.status;
    const id = req.params.idTopic;

    await Topic.updateOne({ _id: id }, {
        status: status
    });

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
    res.redirect("back");
}