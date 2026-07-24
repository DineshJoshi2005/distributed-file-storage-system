import { fileTypeFromFile } from "file-type";
import fs from "fs/promises";
import { ALLOWED_FILE_TYPES } from "../constants/file.constants.js";

export const validateFileSignature = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded.",
            });
        }

        const detectedType = await fileTypeFromFile(req.file.path);

        console.log("Original Name:", req.file.originalname);
        console.log("Multer MIME:", req.file.mimetype);
        console.log("Detected Type:", detectedType);

        if (!detectedType) {
            await fs.unlink(req.file.path);

            return res.status(400).json({
                success: false,
                message: "Unable to determine file type.",
            });
        }

        const allowedExtensions = ALLOWED_FILE_TYPES[detectedType.mime];

        if (!allowedExtensions) {
            await fs.unlink(req.file.path);

            return res.status(400).json({
                success: false,
                message: "Unsupported file type.",
            });
        }

        if (!allowedExtensions.includes(detectedType.ext)) {
            await fs.unlink(req.file.path);

            return res.status(400).json({
                success: false,
                message: "File signature does not match its type.",
            });
        }
        req.file.detectedMime = detectedType.mime;
        req.file.detectedExtension = detectedType.ext;

        next();
    } catch (err) {
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch { }
        }

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};