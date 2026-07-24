import fs from "fs/promises"
import File from "../models/file.model.js"
import path from "path";

//Helper function to get File 
const getOwnedFile = async (fileId, userId) => {
    const file = await File.findOne({
        _id: fileId,
        owner: userId,
    });

    if (!file) {
        throw new Error("File not found.");
    }

    return file;
};

export const uploadFile = async (userId, file)=>{
    const uploadedFile = await File.create({
        owner: userId,
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.detectedMime,
        size: file.size,
        storageKey: file.path,
        storageProvider: "local",
    });

    return uploadedFile;
}

export const getAllFiles = async (userId) => {
    const files = await File.find({
        owner: userId
    }).sort({
        createdAt: -1
    });

    return files;
}

export const getFileById = async (fileId, userId) => {
    return getOwnedFile(fileId, userId);
}

export const downloadFile = async (fileId, userId) => {
    return getOwnedFile(fileId, userId);
}

export const deleteFile = async (fileId, userId) => {
    const file = await getOwnedFile(fileId, userId);
    await fs.unlink(file.storageKey);
    await file.deleteOne();
    return;
}

export const renameFile = async (fileId, userId, newName) => {
    const file = await getOwnedFile(fileId, userId);

    const originalExtension = path.extname(file.storedName);
    const baseName = path.basename(newName.trim(), path.extname(newName));

    file.originalName = `${baseName}${originalExtension}`;

    await file.save();

    return file;
}