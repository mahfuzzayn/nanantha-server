import { z } from "zod";

const registerUserValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "Name is required" }),
        email: z
            .string({ required_error: "Email is required" })
            .email({ message: "Invalid email format" }),
        password: z.string({
            required_error: "Password is required",
        }),
    }),
});

const updateUserValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        oldPassword: z.string().optional(),
        newPassword: z.string().optional(),
    }),
});

const changeStatusValidationSchema = z.object({
    body: z.object({
        isActive: z.boolean({
            required_error: "isActive is required",
        }),
    }),
});

export const UserValidations = {
    registerUserValidationSchema,
    updateUserValidationSchema,
    changeStatusValidationSchema,
};
