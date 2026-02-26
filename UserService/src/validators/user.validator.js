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

module.exports = {
    validateCreateUser,
    validateUpdateUser
}