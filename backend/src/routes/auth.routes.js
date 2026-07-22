import express from "express";
import { getCurrentUser, login, logOut, refreshAccessToken, resendVerificationEmail, signUp, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, resendVerificationSchema, signUpSchema, verifyEmailSchema } from "../validations/auth.validation.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/verify-email", validate(verifyEmailSchema),verifyEmail )
router.post("/resend-verification", validate(resendVerificationSchema), resendVerificationEmail);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", logOut);
export default router;