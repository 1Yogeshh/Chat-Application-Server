const {
    createUserService,
    getMyProfileService,
    getUserProfileService,
    updateUserService,
    searchUserService,
    getUserByIdsService
} = require("../services/user.service")
const userLogger = require("../logger/user.logger")

const createUser = async (req, res, next) => {
    try {
        const { authUserId, email } = req.user

        const result = await createUserService({
            authUserId,
            email,
            ...req.body
        })

        if (result.alreadyExits) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
                data: result.user
            })
        }

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result.user
        })

    } catch (err) {
        userLogger.error({
            action: "USER_CREATE_ERROR",
            error: err.message
        })
        next(err)
    }
}

const getMyProfile = async (req, res, next) => {
    try {
        const user = await getMyProfileService(req.user.authUserId)

        res.status(200).json({
            success: true,
            data: user
        })

    } catch (err) {
        next(err)
    }
}

const getUserProfile = async (req, res) => {
    try {
        const profile = await getUserProfileService(
            req.user.authUserId,
            req.params.authUserId
        )

        res.status(200).json(profile)
    } catch (error) {
        res.status(403).json({ message: err.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await updateUserService({
            authUserId: req.user.authUserId,
            ...req.body
        });

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (err) {
        userLogger.error({
            action: "USER_UPDATE_ERROR",
            error: err.message
        })
        res.status(400).json({
            message: err.message
        });
    }
};

const searchUser = async (req, res) => {
    const { q, page = 1, limit = 20 } = req.query;

    const users = await searchUserService(
        req.user.authUserId,
        q.trim(),
        Number(page),
        Number((limit))
    )

    res.status(200).json(users);
}

const getUsersByIds = async (req, res, next) => {
    try {
        const { ids } = req.body

        const userMap = await getUserByIdsService(ids)

        res.json(userMap);
    } catch (err) {
        next(err)
    }
};

module.exports = {
    createUser,
    getMyProfile,
    getUserProfile,
    updateUser,
    searchUser,
    getUsersByIds
}