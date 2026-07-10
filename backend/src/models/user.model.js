import mongoose from "mongoose";
import bcrypt from "bcrypt";
import env from "../config/env.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength:50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        },
        minlength: 8
    },
    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local"
    },
    avatar: {
        type: String,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUNDS);
    
});

const User = mongoose.model("User", userSchema);

export default User;