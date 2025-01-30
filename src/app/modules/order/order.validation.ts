import { z } from 'zod'

const createPaymentIntentValidationSchema = z.object({
    body: z.object({
        amount: z.number({
            required_error: 'Amount is required and must be a positive number',
        }),
        currency: z.string({
            required_error:
                'Currency is required and must be one of: usd, eur, gbp',
        }),
    }),
})

export const orderValidationSchema = z.object({
    body: z.object({
        order: z.object({
            userId: z.string().min(24, 'User ID is required'),
            items: z.array(
                z.object({
                    productId: z.string().min(24, 'Product ID is required'),
                    title: z.string().min(1, 'Title is required'),
                    author: z.string().min(1, 'Author is required'),
                    image: z.string().url('Invalid image URL'),
                    price: z.number().positive('Price must be positive'),
                    quantity: z
                        .number()
                        .int()
                        .positive('Quantity must be at least 1'),
                    totalPrice: z
                        .number()
                        .positive('Total price must be positive'),
                    _id: z.string().min(1, 'Item ID is required'),
                }),
            ),
            total: z.number().positive('Total amount must be positive'),
            status: z
                .enum([
                    'pending',
                    'approved',
                    'shipped',
                    'delivered',
                    'cancelled',
                ])
                .default('pending'),
            transactionId: z.string().min(1, 'Transaction ID is required'),
            createdAt: z.string().optional(),
        }),
    }),
})

export const OrderValidations = {
    createPaymentIntentValidationSchema,
    orderValidationSchema,
}
