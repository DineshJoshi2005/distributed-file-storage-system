import express from "express";
import { login, refreshAccessToken, resendVerificationEmail, signUp, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, resendVerificationSchema, signUpSchema, verifyEmailSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/verify-email", validate(verifyEmailSchema),verifyEmail )
router.post("/resend-verification", validate(resendVerificationSchema), resendVerificationEmail);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshAccessToken);
export default router;