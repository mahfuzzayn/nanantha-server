import AppError from '../../errors/AppError'
import { TUser } from './user.interface'
import httpStatus from 'http-status'
import { User } from '../User/user.model'

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
    registerUserIntoDB
}
