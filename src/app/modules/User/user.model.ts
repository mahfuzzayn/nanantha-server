/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from "mongoose";
import { IUser, UserModel, UserRole } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser, UserModel>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        passwordChangedAt: {
            type: Date,
        },
        location: {
            type: String,
            default: null,
        },
        profileUrl: {
            type: String,
            default: null,
        },
        reviewsGiven: {
            type: [Schema.Types.ObjectId],
            ref: "Review",
            default: [],
        },
        role: {
            type: String,
            enum: [UserRole.USER, UserRole.ADMIN],
            default: UserRole.USER,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hashing the password before saving
userSchema.pre("save", async function (next) {
    const user = this;

    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    );
    next();
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
    return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
) {
    const passwordChangedTime =
        new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModel>("User", userSchema);

export type TUserRole = keyof typeof UserRole;
