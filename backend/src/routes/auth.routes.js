import express from "express";
import { signUp } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { signUpSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp);

export default router;