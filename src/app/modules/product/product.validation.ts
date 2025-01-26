import { z } from 'zod'

const productValidationSchema = z.object({
    title: z
        .string()
        .min(1, { message: 'Title is required' })
        .regex(/^[a-zA-Z0-9]*$/, {
            message: 'Title should only contain alphanumeric characters',
        }),
    author: z
        .string()
        .min(1, { message: 'Author is required' })
        .regex(/^[a-zA-Z]*$/, {
            message: 'Author should only contain alpha characters',
        }),
    price: z
        .number({ invalid_type_error: 'Price should be a number' })
        .min(0.01, { message: 'Price must be greater than 0' }),
    category: z.enum(
        ['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'],
        {
            errorMap: () => ({ message: 'Invalid category' }),
        },
    ),
    description: z.string().min(1, { message: 'Description is required' }),
    quantity: z
        .number({ invalid_type_error: 'Quantity should be a number' })
        .min(1, { message: 'Quantity must be at least 1' }),

    inStock: z.boolean({
        invalid_type_error: 'inStock should be a boolean',
    }),
})

export default productValidationSchema
