import multer from "multer";
import path from "path";
import crypto from "crypto";
import { ALLOWED_FILE_TYPES } from "../constants/file.constants.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: (req, file, cb) => {
        const storedFileName = crypto.randomUUID() + path.extname(file.originalname);
        cb(null, storedFileName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = Object.keys(ALLOWED_FILE_TYPES);
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Unsupported file type."), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, 
    },
});

export default upload;