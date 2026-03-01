const authRepository = require("../repositories/auth.repository")
const { hashPassword, comparePassword } = require("../utils/password.util")
const { generateAccessToken, generateRefreshToken } = require("../config/generateToken")
const hashToken = require("../utils/hashToken")
const TokenCache = require("../cache/token.cache")
const authLogger = require("../logger/auth.logger")

const register = async (email, password) => {
    const existUser = await authRepository.findUserByEmail(email)

    if (existUser) {
        throw new Error("user already registered")
    }

    const hashed = await hashPassword(password)

    const user = await authRepository.createUser({
        email,
        password: hashed
    })

    authLogger.info({
        action: "REGISTER_SUCCESS",
        userId: user.id
    })

    delete user.password;
    return user;
}

const getAllUsers = async () => {
    return authRepository.getAllUsers();
}

const login = async (email, password) => {
    const user = await authRepository.findUserByEmail(email)

    if (!user) {
        authLogger.warn({ action: "LOGIN_USER_NOT_FOUND", email })
        throw new Error("Invalid Credentials")
    }

    const isMatch = await comparePassword(password, user.password)

    if (!isMatch) {
        authLogger.warn({
            action: "LOGIN_WRONG_PASSWORD",
            userId: user.id
        })
        throw new Error("Invalid Credentials")
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user)

    const refreshTokenHash = hashToken(refreshToken)

    await authRepository.createRefreshToken({
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    await TokenCache.storeRefreshToken(refreshTokenHash, user.id)

    authLogger.info({
        action: "LOGIN_SUCCESS",
        userId: user.id
    })

    const { password: _, ...safeUser } = user;

    return { safeUser, accessToken, refreshToken };
}

module.exports = { register, getAllUsers, login }