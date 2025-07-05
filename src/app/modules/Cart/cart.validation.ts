import { z } from "zod";

export const addItemValidationSchema = z.object({
    body: z.object({
        productId: z
            .string({
                required_error: "productId is required",
            })
            .min(24)
            .max(24),
        quantity: z
            .number({
                required_error: "quantity is required",
            })
            .int()
            .positive(),
    }),
});

export const removeItemValidationSchema = z.object({
    body: z.object({
        productId: z
            .string({
                required_error: "productId is required",
            })
            .min(24)
            .max(24),
    }),
});

export const updateQuantityValidationSchema = z.object({
    body: z.object({
        productId: z
            .string({
                required_error: "productId is required",
            })
            .min(24)
            .max(24),
        quantity: z
            .number({
                required_error: "quantity is required",
            })
            .int(),
    }),
});

export const CartValidations = {
    addItemValidationSchema,
    removeItemValidationSchema,
    updateQuantityValidationSchema,
};
