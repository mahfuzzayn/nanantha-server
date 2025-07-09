import { IUpdateUser, IUser, UserRole } from "./user.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import config from "../../config";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { User } from "./user.model";
import { IImageFile } from "../../interface/IImageFile";
import { IJwtPayload } from "../auth/auth.interface";
import { AuthServices } from "../auth/auth.service";
import { Cart } from "../cart/cart.model";
import mongoose from "mongoose";

const getAllUsersFromDB = async (
    authUser: IJwtPayload,
    query: Record<string, unknown>
) => {
    const usersQuery = new QueryBuilder(
        User.find({ _id: { $ne: authUser?.userId } }),
        query
    )
        .search(userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await usersQuery.modelQuery;
    const meta = await usersQuery.countTotal();

    if (!result) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Failed to retrieve users");
    }

    return {
        meta,
        result,
    };
};

const getMeFromDB = async (authUser: IJwtPayload) => {
    const result = await User.findById(authUser.userId);

    if (!result) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Failed to retrieve user");
    }

    return result;
};

const registerUserIntoDB = async (payload: IUser) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const userData: Partial<IUser> = { ...payload };

        userData.role = UserRole.USER;

        const newUser = new User(userData);
        await newUser.save({ session });

        if (!newUser) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Failed to create user"
            );
        }

        if (newUser?.role === "user") {
            const cart = new Cart({
                user: newUser?._id,
            });

            await cart.save({ session });
        }

        await session.commitTransaction();

        return await AuthServices.loginUser({
            email: userData?.email as string,
            password: userData?.password as string,
        });
    } catch (error) {
        await session.abortTransaction();

        console.log(error);
    } finally {
        await session.endSession();
    }
};

const updateUserIntoDB = async (
    file: IImageFile,
    payload: IUpdateUser,
    authUser: IJwtPayload
) => {
    const user = await User.findById(authUser.userId).select("+password");

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const updateData: Partial<IUpdateUser> = {};

    if (file && file.path) {
        updateData.profileUrl = file.path;
    }

    if (payload?.oldPassword && payload?.newPassword) {
        const isOldPasswordValid = await User.isPasswordMatched(
            payload.oldPassword,
            user.password
        );

        if (!isOldPasswordValid) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Old password is incorrect"
            );
        }

        const hashedPassword = await bcrypt.hash(
            payload.newPassword,
            Number(config.bcrypt_salt_rounds)
        );

        updateData.password = hashedPassword;
    }

    if (payload?.name) {
        updateData.name = payload.name;
    }

    if (payload?.location && payload?.location !== user?.location) {
        updateData.location = payload.location;
    }

    if (Object.keys(updateData).length === 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, "No changes detected");
    }

    const updatedUser = await User.findByIdAndUpdate(
        authUser.userId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedUser) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Failed to update user");
    }

    return updatedUser;
};

const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};

export const UserServices = {
    getAllUsersFromDB,
    getMeFromDB,
    registerUserIntoDB,
    updateUserIntoDB,
    changeStatusIntoDB,
};
