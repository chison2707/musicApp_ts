import mongoose from "mongoose";
import * as generate from "../helper/generate";

const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});
const Account = mongoose.model("Account", accountSchema, "accounts");
export default Account;