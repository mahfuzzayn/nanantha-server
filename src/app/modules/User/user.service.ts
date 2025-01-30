import AppError from '../../errors/AppError'
import { TUpdateUser, TUser } from './user.interface'
import httpStatus from 'http-status'
import { User } from '../User/user.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { userSearchableFields } from './user.constant'
import config from '../../config'
import bcrypt from 'bcrypt'

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

const updateUserIntoDB = async (id: string, payload: TUpdateUser) => {
    const user = await User.findById(id).select('+password')

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    const updateData: Partial<TUpdateUser> = {}

    if (payload?.oldPassword && payload?.newPassword) {
        const isOldPasswordValid = await User.isPasswordMatched(
            payload.oldPassword,
            user.password,
        )

        if (!isOldPasswordValid) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Old password is incorrect',
            )
        }

        const hashedPassword = await bcrypt.hash(
            payload.newPassword,
            Number(config.bcrypt_salt_rounds),
        )

        updateData.password = hashedPassword
    }

    if (payload?.name) {
        updateData.name = payload.name
    }

    if (Object.keys(updateData).length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'No changes detected')
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    })

    if (!updatedUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update user')
    }

    return updatedUser
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
    updateUserIntoDB,
    changeStatusIntoDB,
}
