const userRepo = require("../repository/user.repository")
const { validateCreateUser, validateUpdateUser, validateUserIds } = require("../validators/user.validator")
const { buildCreateUserData, buildUpdateData, mapUsersToObject } = require("../mapper/user.mapper")
const { buildPagination } = require("../pagination/user.pagination")
const { buildSearchQuery } = require("../queryBuilder/user.queryBuilder")

const createUserService = async (payload) => {
    validateCreateUser(payload)

    const { authUserId, username } = payload

    const usernameTaken = await userRepo.findByUsername(username)

    if (usernameTaken) {
        throw new Error("Username already taken");
    }

    const existUser = await userRepo.findByAuthId(authUserId)

    if (existUser) {
        return {
            alreadyExits: true,
            user: existUser
        }
    }

    const data = buildCreateUserData(payload)

    const user = await userRepo.createUser(data)

    return {
        alreadyExits: false,
        user
    };
}

//get my profile
const getMyProfileService = async (authUserId) => {
    return userRepo.findByAuthId(authUserId)
}

//get another user profile
const getUserProfileService = async (myAuthUserId, targetAuthUserId) => {
    if (myAuthUserId === targetAuthUserId) {
        throw new Error("This is your own id not user id")
    }

    const targetUser = await userRepo.findByAuthId(targetAuthUserId)

    if (!targetUser || !targetUser.isActive) {
        throw new Error("User not Found")
    }

    return targetUser;
}

const updateUserService = async (payload) => {
    validateUpdateUser(payload)

    const { authUserId, username } = payload


    // ✅ username update (optional)
    if (username && username.trim() !== "") {
        const cleanUsername = username.trim().toLowerCase();

        // 🔥 check username uniqueness (exclude self)
        const existingUser = await userRepo.findByUsername(cleanUsername)

        if (existingUser) {
            throw new Error("Username already taken");
        }

        data.username = cleanUsername;
    }

    const data = buildUpdateData(payload)

    return userRepo.updateUser(authUserId, data)
};

const searchUserService = async (
    myAuthUserId,
    searchText,
    page = 1,
    limit = 20
) => {
    // 🔹 Business Rule
    if (!searchText || searchText.trim() === "") {
        throw new Error("Search text required")
    }

    const where = buildSearchQuery({
        searchText,
        myAuthUserId
    })

    const { skip, take } = buildPagination(page, limit)

    return userRepo.searchUsers(where, skip, take)
}

const getUserByIdsService = async (ids) => {
    validateUserIds(ids)

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