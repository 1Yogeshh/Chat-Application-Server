const validateCreateUser = ({ authUserId, email, name, username }) => {
    if (!authUserId || !email || !name || !username) {
        throw new Error("All fields are required")
    }
}

const validateUpdateUser = ({ name, username }) => {
    if (!name && !username) {
        throw new Error("Nothing to update")
    }
}

const validateUserIds = (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("User ids required")
    }
}

module.exports = {
    validateCreateUser,
    validateUpdateUser,
    validateUserIds
}