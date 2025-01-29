import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { UserServices } from './user.service'

const getAllUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUsersFromDB(req.query)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.result,
    })
})

const getMe = catchAsync(async (req, res) => {
    const { email } = req.body
    const result = await UserServices.getMeFromDB(email)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    })
})

const registerUser = catchAsync(async (req, res) => {
    const { user: userData } = req.body

    const result = await UserServices.registerUserIntoDB(userData)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User registered successfully',
        data: result,
    })
})

const changeStatus = catchAsync(async (req, res) => {
    const id = req.params.id

    const result = await UserServices.changeStatusIntoDB(id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Status is updated successfully',
        data: result,
    })
})

export const UserControllers = {
    getAllUsers,
    getMe,
    registerUser,
    changeStatus,
}
