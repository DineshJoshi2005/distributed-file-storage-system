import fs from "fs/promises"
import File from "../models/file.model.js"
import FilePermission from "../models/filePermission.model.js";
import User from "../models/user.model.js"
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

const generateUniqueFileName = async (
    userId,
    originalName,
    excludeFileId = null
) => {
    const { name, ext } = path.parse(originalName);

    let counter = 0;

    while (true) {
        const candidateName =
            counter === 0
                ? `${name}${ext}`
                : `${name} (${counter})${ext}`;

        const query = {
            owner: userId,
            originalName: candidateName,
        };

        if (excludeFileId) {
            query._id = { $ne: excludeFileId };
        }

        const existingFile = await File.findOne(query);

        if (!existingFile) {
            return candidateName;
        }

        counter++;
    }
};
export const uploadFile = async (userId, file) => {
    const uniqueFileName = await generateUniqueFileName(
        userId,
        file.originalname
    );

    const uploadedFile = await File.create({
        owner: userId,
        originalName: uniqueFileName,
        storedName: file.filename,
        mimeType: file.detectedMime,
        size: file.size,
        storageKey: file.path,
        storageProvider: "local",
    });

    return uploadedFile;
};

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

export const renameFile = async (fileId,userId,newName) => {
    const file = await getOwnedFile(fileId, userId);

    const extension = path.extname(file.storedName);
    const baseName = path.parse(newName.trim()).name;

    const uniqueFileName = await generateUniqueFileName(
        userId,
        `${baseName}${extension}`,
        file._id
    );

    file.originalName = uniqueFileName;

    await file.save();

    return file;
};

export const shareFile = async (fileId,ownerId,email,permission) => {
    const file = await File.findById(fileId);

    if (!file) {
        throw new Error("File not found.");
    }

    if (file.owner.toString() !== ownerId.toString()) {
        throw new Error("Only the owner can share this file.");
    }

    const recipient = await User.findOne({ email });

    if (!recipient) {
        throw new Error("Recipient user not found.");
    }

    if (recipient._id.toString() === ownerId.toString()) {
        throw new Error("You cannot share a file with yourself.");
    }

    const existingPermission = await FilePermission.findOne({
        file: fileId,
        user: recipient._id,
    });

    if (existingPermission) {
        throw new Error("File already shared with this user.");
    }

    const filePermission = await FilePermission.create({
        file: fileId,
        user: recipient._id,
        permission,
    });

    return filePermission;
};

export const getSharedFiles = async(userId)=> {
    const permissions = await FilePermission.find({ user: userId }).populate("file");
    const files = permissions.map((permission) => ({
        ...permission.file.toObject(),
        permission: permission.permission,
    }));
    return files;
}   

export const updatePermission = async(fileId, ownerId, userId, permission)=>{
    await getOwnedFile(fileId, ownerId);

    const filePermission = await FilePermission.findOne({
        file: fileId,
        user: userId,
    });

    if (!filePermission) {
        throw new Error("Permission not found.");
    }

    if (filePermission.permission === permission) {
        throw new Error(`User already has ${permission} permission.`);
    }

    filePermission.permission = permission;
    await filePermission.save();
    return filePermission;
}

export const revokeAccess = async (fileId, ownerId,userId) => {

    await getOwnedFile(fileId, ownerId);

    const filePermission = await FilePermission.findOne({
        file: fileId,
        user: userId,
    });

    if (!filePermission) {
        throw new Error("Permission not found.");
    }

    await filePermission.deleteOne();
};