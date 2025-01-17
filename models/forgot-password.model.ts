import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 180
    }
}, {
    timestamps: true
});
const ForgorPassword = mongoose.model("ForgorPassword", forgotPasswordSchema, "forgot-password");
export default ForgorPassword;