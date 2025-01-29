import { z } from 'zod'

export const addItemSchema = z.object({
    body: z.object({
        item: z.object({
            userId: z
                .string({
                    required_error: 'userId is required',
                })
                .min(24)
                .max(24),
            productId: z
                .string({
                    required_error: 'productId is required',
                })
                .min(24)
                .max(24),
            quantity: z
                .number({
                    required_error: 'quantity is required',
                })
                .int()
                .positive(),
        }),
    }),
})

export const removeItemSchema = z.object({
    body: z.object({
        userId: z
            .string({
                required_error: 'userId is required',
            })
            .min(24)
            .max(24),
        productId: z
            .string({
                required_error: 'productId is required',
            })
            .min(24)
            .max(24),
    }),
})

export const updateQuantitySchema = z.object({
    body: z.object({
        userId: z
            .string({
                required_error: 'userId is required',
            })
            .min(24)
            .max(24),
        productId: z
            .string({
                required_error: 'productId is required',
            })
            .min(24)
            .max(24),
        quantity: z
            .number({
                required_error: 'quantity is required',
            })
            .int(),
    }),
})

export const clearCartSchema = z.object({
    body: z.object({
        userId: z
            .string({
                required_error: 'userId is required',
            })
            .min(24)
            .max(24),
    }),
})

export const CartValidations = {
    addItemSchema,
    removeItemSchema,
    updateQuantitySchema,
    clearCartSchema,
}
