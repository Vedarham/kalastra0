// To iinitialize random Token: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

import jwt from "jsonwebtoken";

export const generateAccessToken = function (user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role
    },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })

}

export const generateRefreshToken = function (user) {
    return jwt.sign({
        _id: user._id,
    },
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}
