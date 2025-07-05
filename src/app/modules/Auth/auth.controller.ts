import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import config from "../../config";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);
    
    const { refreshToken, accessToken } = result;

    res.cookie("refreshToken", refreshToken, {
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User logged in successfully!",
        data: {
            accessToken,
            refreshToken,
        },
    });
});

export const AuthController = {
    loginUser,
};
