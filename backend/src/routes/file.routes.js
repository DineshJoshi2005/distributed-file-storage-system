import express from 'express';
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../config/multer.js';
import { download, getFile, getFiles, getSharedFiles, removeFile, rename, revokeAccess, shareFile, updatePermission, upload as uploadController } from "../controllers/file.controller.js";

import { validateFileSignature } from '../middleware/fileSignature.middleware.js';
import { shareFileSchema, updatePermissionSchema } from '../validations/file.validation.js';
import { authorizeFileAccess } from '../middleware/authorizeFileAccess.middleware.js';

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"),validateFileSignature, uploadController);
router.get("/", authenticate, getFiles);
router.get("/shared", authenticate, getSharedFiles);
router.get("/:id", authenticate, getFile);
router.get("/:id/download", authenticate, authorizeFileAccess("viewer"), download);
router.delete("/:id", authenticate, removeFile);
router.patch("/:id/rename", authenticate, authorizeFileAccess("editor"), rename);
router.post("/:id/share", authenticate, validate(shareFileSchema), shareFile);
router.patch("/:id/share/:userId", authenticate, validate(updatePermissionSchema), updatePermission);
router.delete("/:id/share/:userId", authenticate, revokeAccess);

export default router;
