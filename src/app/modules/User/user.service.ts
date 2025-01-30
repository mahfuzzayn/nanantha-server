import AppError from '../../errors/AppError'
import { TUser } from './user.interface'
import httpStatus from 'http-status'
import { User } from '../User/user.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { userSearchableFields } from './user.constant'

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
    const usersQuery = new QueryBuilder(User.find({ role: 'user' }), query)
        .search(userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await usersQuery.modelQuery
    const meta = await usersQuery.countTotal()

    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to retrieve users')
    }

    return {
        meta,
        result,
    }
}

const getMeFromDB = async (id: string) => {
    const result = await User.findById(id)

    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to retrieve user')
    }

    return result
}

const registerUserIntoDB = async (payload: TUser) => {
    const userData: Partial<TUser> = { ...payload }

    userData.role = 'user'

    const newUser = await User.create(userData)

    if (!newUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }

    return newUser
}

const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, {
        new: true,
    })
    return result
}

export const UserServices = {
    getAllUsersFromDB,
    getMeFromDB,
    registerUserIntoDB,
    changeStatusIntoDB,
}
