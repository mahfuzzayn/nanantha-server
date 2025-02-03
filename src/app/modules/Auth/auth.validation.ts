import { z } from 'zod'

const loginValidationSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required.' })
            .email({ message: 'Invalid email format' }),
        password: z.string({ required_error: 'Password is required' }),
    }),
})

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            required_error: 'Old password is required',
        }),
        newPassword: z.string({ required_error: 'Password is required' }),
    }),
})

export const AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
}
