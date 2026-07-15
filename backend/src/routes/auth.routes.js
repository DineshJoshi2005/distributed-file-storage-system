import express from "express";
import { signUp, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { signUpSchema, verifyEmailSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/verify-email", validate(verifyEmailSchema),verifyEmail )

export default router;