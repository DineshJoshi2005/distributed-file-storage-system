import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(50, "Name cannot exceed 50 characters. "),

    email: z
        .email("Invalid email address")
        .transform((email) => email.toLowerCase()),

    password: z.string()
        .min(8, "Password must be at least 8 characters.")
        .max(100)

})          

export const verifyEmailSchema = z.object({
    token: z
        .string()
        .trim()
        .min(1, "Verification token is required.")
});