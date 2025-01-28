import { z } from 'zod'

const createProductValidationSchema = z.object({
    body: z.object({
        product: z.object({
            title: z.string().min(1, { message: 'Title is required' }),
            author: z.string().min(1, { message: 'Author is required' }),
            price: z
                .number({ invalid_type_error: 'Price should be a number' })
                .min(0.01, { message: 'Price must be greater than 0' }),
            category: z.enum(
                [
                    'Fiction',
                    'Science',
                    'SelfDevelopment',
                    'Poetry',
                    'Religious',
                ],
                {
                    errorMap: () => ({ message: 'Invalid category' }),
                },
            ),
            description: z
                .string()
                .min(1, { message: 'Description is required' }),
            quantity: z
                .number({ invalid_type_error: 'Quantity should be a number' })
                .min(1, { message: 'Quantity must be at least 1' }),

            inStock: z
                .boolean({
                    invalid_type_error: 'inStock should be a boolean',
                })
                .optional(),
        }),
    }),
})

const updateProductValidationSchema = z.object({
    body: z.object({
        product: z.object({
            title: z.string().optional(),
            author: z.string().optional(),
            price: z
                .number({ invalid_type_error: 'Price should be a number' })
                .optional(),
            category: z
                .enum(
                    [
                        'Fiction',
                        'Science',
                        'SelfDevelopment',
                        'Poetry',
                        'Religious',
                    ],
                    {
                        errorMap: () => ({ message: 'Invalid category' }),
                    },
                )
                .optional(),
            description: z.string().optional(),
            quantity: z
                .number({ invalid_type_error: 'Quantity should be a number' })
                .optional(),

            inStock: z
                .boolean({
                    invalid_type_error: 'inStock should be a boolean',
                })
                .optional(),
        }),
    }),
})

export const ProductValidations = {
    createProductValidationSchema,
    updateProductValidationSchema
}
