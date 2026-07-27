import mongoose from "mongoose";

const filePermissionSchema = new mongoose.Schema({
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    permission: {
        type: String,
        enum: ["viewer", "editor"],
        default: "viewer",
        required: true,
    },
}, {
    timestamps: true
})

filePermissionSchema.index(
    { file: 1, user: 1 },
    { unique: true }
);

const FilePermission = mongoose.model(
    "FilePermission",
    filePermissionSchema
);

export default FilePermission;