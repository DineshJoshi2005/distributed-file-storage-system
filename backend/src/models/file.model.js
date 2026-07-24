import mongoose from "mongoose";


const fileSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    originalName: {
        type: String,
        required: true,
        trim: true,
    },
    storedName: {
        type: String,
        required: true,
        unique: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    storageKey: {
        type: String,
        required: true,
    },
    storageProvider: {
        type: String,
        enum: ["local", "s3"],
        default: "local",
    },
},
    {
        timestamps: true
    });

const File = mongoose.model("File", fileSchema);

export default File;