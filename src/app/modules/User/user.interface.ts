import { Model } from 'mongoose'

export type TUser = {
    name: string
    email: string
    password: string
    passwordChangedAt?: Date
    role: 'user' | 'admin'
    isDeactivated: boolean
}

export interface UserModel extends Model<TUser> {
    // Instance method for checking if the user exist
    isUserExistsByEmail(id: string): Promise<TUser>
    // Instance method for checking if passwords are matched
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>
    // Instance method for checking if jwt issued before password change
    isJWTIssuedBeforePasswordChanged(
        passwordChangedTimestamp: Date,
        jwtIssuedTimestamp: number,
    ): boolean
}
