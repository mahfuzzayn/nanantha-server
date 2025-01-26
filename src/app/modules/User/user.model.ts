/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import config from '../../config'
import bcrypt from 'bcrypt'
import { USER_ROLE } from './user.constant'

const userSchema = new Schema<TUser, UserModel>(
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
        passwordChangedAt: {
            type: Date,
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

// Hashing the password before saving
userSchema.pre('save', async function (next) {
    const user = this

    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    )
    next()
})

// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = ''
    next()
})

userSchema.statics.isUserExistsByEmail = async function (email: string) {
    return await User.findOne({ email }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
) {
    const passwordChangedTime =
        new Date(passwordChangedTimestamp).getTime() / 1000
    return passwordChangedTime > jwtIssuedTimestamp
}

export const User = model<TUser, UserModel>('User', userSchema)

export type TUserRole = keyof typeof USER_ROLE
