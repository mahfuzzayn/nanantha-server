import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { IImageFile } from "../../interface/IImageFile";
import { IJwtPayload } from "../auth/auth.interface";

const getAllUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUsersFromDB(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await UserServices.getMeFromDB(userId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});

const registerUser = catchAsync(async (req, res) => {
    const result = await UserServices.registerUserIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req, res) => {
    const result = await UserServices.updateUserIntoDB(
        req.file as IImageFile,
        req.body,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});

const changeStatus = catchAsync(async (req, res) => {
    const id = req.params.id;

    const result = await UserServices.changeStatusIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Status is updated successfully",
        data: result,
    });
});

export const UserControllers = {
    getAllUsers,
    getMe,
    registerUser,
    updateUser,
    changeStatus,
};
