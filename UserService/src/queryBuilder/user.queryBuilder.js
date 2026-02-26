const buildSearchQuery = ({ searchText, myAuthUserId }) => {

    return {
        authUserId: { not: myAuthUserId },
        OR: [
            {
                name: {
                    contains: searchText,
                    mode: "insensitive"
                }
            },
            {
                email: {
                    contains: searchText,
                    mode: "insensitive"
                }
            },
            {
                username: {
                    contains: searchText,
                    mode: "insensitive"
                }
            }
        ]
    }
}

module.exports = { buildSearchQuery }