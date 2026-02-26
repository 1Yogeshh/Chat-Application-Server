const buildCreateUserData = ({ authUserId, email, name, username }) => {
    return {
        authUserId,
        email,
        name: name.trim(),
        username: username.trim().toLowerCase(),
        role: "USER",
        avtar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
        isActive: true
    }
}

const buildUpdateData = ({ name, username }) => {
    const data = {}

    if (name) data.name = name.trim()
    if (username) data.username = username.trim().toLowerCase()

    return data
}

const mapUsersToObject = (users) => {
    return users.reduce((acc, user) => {
        acc[user.authUserId] = user
        return acc
    }, {})
}

module.exports = {
    buildCreateUserData,
    buildUpdateData,
    mapUsersToObject
}