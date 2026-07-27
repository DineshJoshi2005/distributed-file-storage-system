import File from "../models/file.model.js";
import FilePermission from "../models/filePermission.model.js";

export const authorizeFileAccess = (requiredPermission) => {
    return async (req, res, next) => {
        try {

            const fileId = req.params.id;
            const userId = req.user._id;


            const file = await File.findById(fileId);

            if (!file) {
                throw new Error("File not found.");
            }

            if (file.owner.toString() === userId.toString()) {
                return next();
            }

            const filePermission = await FilePermission.findOne({
                file: fileId,
                user: userId,
            });

            if (!filePermission) {
                throw new Error("You don't have access to this file.");
            }

            const permissionLevels = {
                viewer: 1,
                editor: 2,
            };

            if (
                permissionLevels[filePermission.permission] <
                permissionLevels[requiredPermission]
            ) {
                throw new Error(
                    "You don't have permission to perform this action."
                );
            }

            next();

        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    }
}