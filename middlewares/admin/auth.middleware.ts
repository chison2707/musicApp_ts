import { NextFunction, Request, Response } from "express";
import { systemConfig } from "../../config/config";
import Account from "../../models/account.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        return;
    } else {
        const user = await Account.findOne({ token: req.cookies.token }).select("-password");
        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }
        // else {
        //     const role = await Role.findOne({
        //         _id: user.role_id
        //     }).select("title permissions");

        res.locals.user = user;
        // res.locals.role = role;
        next();
    }
}
// }