import { z } from "zod";

export const renameFileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "File name is required.")
        .max(255, "File name is too long."),
});


export const shareFileSchema = z.object({
    
        email: z
            .string()
            .trim()
            .email("Please provide a valid email address.")
            .transform((email) => email.toLowerCase()),

        permission: z.enum(["viewer", "editor"], {
            errorMap: () => ({
                message: "Permission must be either viewer or editor.",
            }),
        }),
    
});

export const updatePermissionSchema = z.object({
    body: z.object({
        permission: z.enum(["viewer", "editor"]),
    }),
});