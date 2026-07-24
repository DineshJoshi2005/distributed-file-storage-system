import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../config/multer.js';
import { download, getFile, getFiles, removeFile, rename, upload as uploadController } from "../controllers/file.controller.js";
import { validateFileSignature } from '../middleware/fileSignature.middleware.js';

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"),validateFileSignature, uploadController);
router.get("/", authenticate, getFiles);
router.get("/:id", authenticate, getFile);
router.get("/:id/download", authenticate, download);
router.delete("/:id", authenticate, removeFile);
router.patch("/:id/rename", authenticate, rename);

export default router;
