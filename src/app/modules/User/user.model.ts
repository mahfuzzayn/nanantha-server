/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose'
import { TUser } from './user.interface'
import config from '../../config'
import bcrypt from 'bcrypt'

const userSchema = new Schema<TUser>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
        },
    },
    {
        timestamps: true,
    },
)

userSchema.pre('save', async function (next) {
    const user = this

    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    )
    next()
})

export const User = model<TUser>('User', userSchema)
