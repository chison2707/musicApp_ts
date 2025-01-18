import { Request, Response } from "express";
import Account from "../../models/account.model";

// //[GET] / admin/accounts
// module.exports.index = async (req: Request, res: Response) => {
//     let find = {
//         deleted: false
//     };

//     const records = await Account.find(find).select("-password -token");

//     // for (const record of records) {
//     //     const role = await Role.findOne({
//     //         _id: record.role_id,
//     //         deleted: false
//     //     });
//     //     record.role = role;
//     // }

//     res.render("admin/pages/accounts/index", {
//         pageTitle: "Danh sách tài khoản",
//         records: records
//     });
// }

// //[GET] / admin/accounts/create
// module.exports.create = async (req, res) => {
//     const roles = await Role.find({ deleted: false });

//     res.render("admin/pages/accounts/create", {
//         pageTitle: "Tạo mới tài khoản",
//         roles: roles
//     });
// }