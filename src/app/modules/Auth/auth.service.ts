import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { User } from '../User/user.model'
import { TLoginUser } from './auth.interface'
import { createToken } from './auth.utils'
import bcrypt from 'bcrypt'
import { JwtPayload } from 'jsonwebtoken'

const loginUserFromDB = async (payload: TLoginUser) => {
    // checking if the user is exist
    const user = await User.isUserExistsByEmail(payload.email)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
    }

    const jwtPayload = {
        userEmail: user.email,
        role: user.role,
    }

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    )

    return {
        accessToken,
    }
}

const changePasswordIntoDB = async (
    userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {
    // Checking if the user is exist
    const user = await User.isUserExistsByEmail(userData.userEmail)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
    }

    // Checking if the password is correct
    if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')

    // Hashing new password
    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    )

    const result = await User.findOneAndUpdate(
        {
            email: userData.userEmail,
            role: userData.role,
        },
        {
            password: newHashedPassword,
            passwordChangedAt: new Date(),
        },
    )

    return {
        passwordChangedAt: result?.passwordChangedAt,
    }
}

export const AuthServices = {
    loginUserFromDB,
    changePasswordIntoDB,
}
