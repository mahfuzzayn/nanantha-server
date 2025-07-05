import { Model, Types } from "mongoose";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    passwordChangedAt?: Date;
    profileUrl: string;
    role: UserRole;
    isActive: boolean;
}

export interface IUpdateUser {
    name: string;
    password: string;
    oldPassword: string;
    newPassword: string;
    profileUrl: string;
}

export interface UserModel extends Model<IUser> {
    // Instance method for checking if the user exist
    isUserExistsByEmail(id: string): Promise<IUser>;
    // Instance method for checking if passwords are matched
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string
    ): Promise<boolean>;
    // Instance method for checking if jwt issued before password change
    isJWTIssuedBeforePasswordChanged(
        passwordChangedTimestamp: Date,
        jwtIssuedTimestamp: number
    ): boolean;
}
