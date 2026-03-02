const userRepo = require("../repository/user.repository")
const { validateCreateUser, validateUpdateUser, validateUserIds } = require("../validators/user.validator")
const { buildCreateUserData, buildUpdateData, mapUsersToObject } = require("../mapper/user.mapper")
const { buildPagination } = require("../pagination/user.pagination")
const { buildSearchQuery } = require("../queryBuilder/user.queryBuilder")
const userLogger = require("../logger/user.logger")

const createUserService = async (payload) => {
    validateCreateUser(payload)

    const { authUserId, username } = payload

    userLogger.info({
        action: "CREATE_USER_ATTEMPT",
        authUserId,
        username
    })

    const usernameTaken = await userRepo.findByUsername(username)

    if (usernameTaken) {
        userLogger.error({
            action: "USERNAME_ALREADY_TAKEN",
            username
        })
        throw new Error("Username already taken");
    }

    const existUser = await userRepo.findByAuthId(authUserId)

    if (existUser) {
        userLogger.info({
            action: "USER_ALREADY_EXISTS",
            authUserId
        })
        return {
            alreadyExits: true,
            user: existUser
        }
    }

    const data = buildCreateUserData(payload)

    const user = await userRepo.createUser(data)

    userLogger.info({
        action: "USER_CREATED_SUCCESS",
        userId: user.authUserId,
        username: user.username
    })

    return {
        alreadyExits: false,
        user
    };
}

//get my profile
const getMyProfileService = async (authUserId) => {
    userLogger.info({
        action: "GET_MY_PROFILE",
        authUserId
    })
    return userRepo.findByAuthId(authUserId)
}

//get another user profile
const getUserProfileService = async (myAuthUserId, targetAuthUserId) => {
    if (myAuthUserId === targetAuthUserId) {
        userLogger.warn({
            action: "SELF_PROFILE_ACCESS_ATTEMPT",
            authUserId: myAuthUserId
        })
        throw new Error("This is your own id not user id")
    }

    const targetUser = await userRepo.findByAuthId(targetAuthUserId)

    if (!targetUser || !targetUser.isActive) {
        userLogger.warn({
            action: "TARGET_USER_NOT_FOUND",
            targetAuthUserId
        })
        throw new Error("User not Found")
    }

    userLogger.info({
        action: "GET_USER_PROFILE_SUCCESS",
        requester: myAuthUserId,
        target: targetAuthUserId
    })

    return targetUser;
}

const updateUserService = async (payload) => {

    validateUpdateUser(payload)

    const { authUserId, username } = payload

    userLogger.info({
        action: "UPDATE_USER_ATTEMPT",
        authUserId
    })

    const data = buildUpdateData(payload)

    if (username && username.trim() !== "") {

        const cleanUsername = username.trim().toLowerCase()

        const existingUser = await userRepo.findByUsername(cleanUsername)

        if (existingUser && existingUser.authUserId !== authUserId) {
            userLogger.warn({
                action: "UPDATE_USERNAME_TAKEN",
                username: cleanUsername
            })
            throw new Error("Username already taken")
        }

        data.username = cleanUsername
    }

    userLogger.info({
        action: "UPDATE_USER_SUCCESS",
        userId: authUserId
    })

    return userRepo.updateUser(authUserId, data)
}

const searchUserService = async (
    myAuthUserId,
    searchText,
    page = 1,
    limit = 20
) => {
    if (!searchText || searchText.trim() === "") {
        userLogger.warn({
            action: "SEARCH_EMPTY_QUERY",
            requester: myAuthUserId
        })
        throw new Error("Search text required")
    }

    userLogger.info({
        action: "SEARCH_USER",
        requester: myAuthUserId,
        query: searchText,
        page,
        limit
    })

    const where = buildSearchQuery({
        searchText,
        myAuthUserId
    })

    const { skip, take } = buildPagination(page, limit)

    return userRepo.searchUsers(where, skip, take)
}

const getUserByIdsService = async (ids) => {
    validateUserIds(ids)

    userLogger.info({
        action: "GET_USERS_BY_IDS",
        count: ids.length
    })

    const users = await userRepo.findUsersByIds(ids)

    return mapUsersToObject(users)
}

module.exports = {
    createUserService,
    getMyProfileService,
    getUserProfileService,
    updateUserService,
    searchUserService,
    getUserByIdsService
}