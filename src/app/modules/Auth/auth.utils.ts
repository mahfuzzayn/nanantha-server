import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

export const createToken = (
    jwtPayload: { userEmail: string; role: string },
    secret: string,
    expiresIn: string | number,
) => {
    const options: SignOptions = {
        expiresIn: expiresIn as
            | number
            | `${number}s`
            | `${number}m`
            | `${number}h`
            | `${number}d`
            | `${number}w`
            | `${number}y`,
    }
    return jwt.sign(jwtPayload, secret, options)
}

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as JwtPayload
}
