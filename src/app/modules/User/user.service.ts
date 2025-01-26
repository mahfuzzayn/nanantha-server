import AppError from '../../errors/AppError'
import { TUser } from './user.interface'
import { User } from './user.model'
import httpStatus from 'http-status'

const registerUserIntoDB = async (payload: TUser) => {
    const userData: Partial<TUser> = { ...payload }

    userData.role = 'user'

    const newUser = await User.create(userData)

    if (!newUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }

    return newUser
}

export const UserServices = {
    registerUserIntoDB,
}
