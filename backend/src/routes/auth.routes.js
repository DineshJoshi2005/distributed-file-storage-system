import express from "express";
import { forgotPassword, getCurrentUser, login, logOut, logOutAllDevices, refreshAccessToken, resendVerificationEmail, resetPassword, signUp, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, resendVerificationSchema, resetPasswordSchema, signUpSchema, verifyEmailSchema } from "../validations/auth.validation.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/verify-email", validate(verifyEmailSchema),verifyEmail )
router.post("/resend-verification", validate(resendVerificationSchema), resendVerificationEmail);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", logOut);
router.post("/logout-all", authenticate, logOutAllDevices);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;