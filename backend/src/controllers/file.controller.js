import { getAllFiles, getFileById, uploadFile, downloadFile, deleteFile, renameFile } from "../services/file.service.js";

export const upload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded.",
            });
        }
        const uploadedFile = await uploadFile(req.user._id, req.file);

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully.",
            data: uploadedFile,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

export const getFiles = async (req, res) => {
    try {
        const files = await getAllFiles(req.user._id);
        return res.status(200).json({
            success: true,
            data: files,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

export const getFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const userId = req.user._id;
        const file = await getFileById(fileId, userId);
        return res.status(200).json({
            success: true,
            data: file,
        });
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: err.message,
        });
    }
}

export const download = async (req, res) => {
    try {
        const file = await downloadFile(
            req.params.id,
            req.user._id
        );

        return res.download(
            file.storageKey,
            file.originalName
        );
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: err.message,
        });
    }
};

export const removeFile = async (req, res) => {
    try {
        await deleteFile(req.params.id, req.user._id);

        return res.status(200).json({
            success: true,
            message: "File deleted successfully.",
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const rename = async (req, res) => {
    try {
        const file = await renameFile(
            req.params.id,
            req.user._id,
            req.body.name
        );

        return res.status(200).json({
            success: true,
            message: "File renamed successfully.",
            data: file,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};