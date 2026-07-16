import express from "express";
import { resendVerificationEmail, signUp, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { resendVerificationSchema, signUpSchema, verifyEmailSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/verify-email", validate(verifyEmailSchema),verifyEmail )
router.post("/resend-verification", validate(resendVerificationSchema), resendVerificationEmail);

export default router;