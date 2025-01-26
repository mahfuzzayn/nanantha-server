import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.service'

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUserFromDB(req.body)
    const { accessToken } = result

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged in successfully!',
        data: {
            accessToken,
        },
    })
})

const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body

    const result = await AuthServices.changePasswordIntoDB(
        req.user,
        passwordData,
    )
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password changed successfully!',
        data: result,
    })
})

export const AuthControllers = {
    loginUser,
    changePassword,
}
