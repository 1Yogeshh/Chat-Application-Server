const prisma = require("../prisma")

const createUserService = async({ authUserId, email, name, username }) => {

    const usernameTaken = await prisma.user.findUnique({
        where: { username }
    });

    if (usernameTaken) {
        throw new Error("Username already taken");
    }

    const existUser = await prisma.user.findUnique({
        where: { authUserId }
    })

    if (existUser) {
        return {
            alreadyExits: true,
            user: existUser
        }
    }

    // 🎯 Dynamic Avatar Generate
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;

    //create new user
    const user = await prisma.user.create({
        data: {
            authUserId,
            email,
            name: name.trim(),
            username,
            role: "USER",
            avtar: avatarUrl,
            isActive: true
        }
    })

    return {
        alreadyExits: false,
        user
    };
}

//get my profile
const getMyProfileService = async(authUserId) => {
    return prisma.user.findUnique({
        where: { authUserId }
    })
}

//get another user profile
const getUserProfileService = async(myAuthUserId, targetAuthUserId) => {
    if (myAuthUserId === targetAuthUserId) {
        throw new Error("This is your own id not user id")
    }

    const targetUser = await prisma.user.findUnique({
        where: { authUserId: targetAuthUserId },
        select: {
            authUserId: true,
            name: true,
            username: true,
            email: true,
            isActive: true
        }
    })

    if (!targetUser || !targetUser.isActive) {
        throw new Error("User not Found")
    }

    const blocked = await prisma.blockedUser.findFirst({
        where: {
            OR: [{
                    blockerAuthUserId: myAuthUserId,
                    blockedAuthUserId: targetAuthUserId
                },
                {
                    blockerAuthUserId: targetAuthUserId,
                    blockedAuthUserId: myAuthUserId
                }
            ]
        }
    })

    if (blocked) {
        throw new Error("You cannot view this profile")
    }

    return targetUser;
}

const updateUserService = async({ authUserId, name, username }) => {
    const data = {};

    // ✅ name update (optional)
    if (name && name.trim() !== "") {
        data.name = name.trim();
    }

    // ✅ username update (optional)
    if (username && username.trim() !== "") {
        const cleanUsername = username.trim().toLowerCase();

        // 🔥 check username uniqueness (exclude self)
        const existingUser = await prisma.user.findFirst({
            where: {
                username: cleanUsername,
                NOT: {
                    authUserId: authUserId
                }
            }
        });

        if (existingUser) {
            throw new Error("Username already taken");
        }

        data.username = cleanUsername;
    }

    // ❌ nothing to update
    if (Object.keys(data).length === 0) {
        throw new Error("Nothing to update");
    }

    return prisma.user.update({
        where: { authUserId },
        data,
        select: {
            authUserId: true,
            name: true,
            username: true,
            email: true,
            isActive: true,
            updatedAt: true
        }
    });
};

//helper check user exist or not
const userExists = async(authUserId) => {
    const user = await prisma.user.findUnique({
        where: {
            authUserId
        },
        select: {
            authUserId: true
        }
    })

    return !!user
}

//block user
const blockUserService = async(blockerAuthUserId, blockedAuthUserId) => {
    if (blockerAuthUserId === blockedAuthUserId) {
        throw new Error("You cannot block yourself")
    }

    const receiverExists = await userExists(blockedAuthUserId)
    if (!receiverExists) {
        throw new Error("User to block does not exist")
    }

    const alreadyBlock = await prisma.blockedUser.findUnique({
        where: {
            blockerAuthUserId_blockedAuthUserId: {
                blockerAuthUserId,
                blockedAuthUserId
            }
        }
    })

    if (alreadyBlock) {
        throw new Error("User Already Blocked")
    }

    await prisma.blockedUser.create({
        data: {
            blockerAuthUserId,
            blockedAuthUserId
        }
    })
}

//unblock
const unblockService = async(blockerAuthUserId, blockedAuthUserId) => {
    const receiverExists = await userExists(blockedAuthUserId);
    if (!receiverExists) {
        throw new Error("User does not exist");
    }

    await prisma.blockedUser.delete({
        where: {
            blockerAuthUserId_blockedAuthUserId: {
                blockerAuthUserId,
                blockedAuthUserId
            }
        }
    })
}

//block list
const blockListService = async(blockerAuthUserId) => {
    // 1️⃣ blocked users ke authUserIds nikalo
    const blockedRows = await prisma.blockedUser.findMany({
        where: { blockerAuthUserId },
        select: {
            blockedAuthUserId: true
        }
    });

    const blockedAuthUserIds = blockedRows.map(
        row => row.blockedAuthUserId
    );

    if (blockedAuthUserIds.length === 0) {
        return [];
    }

    // 2️⃣ User table se unka data lao
    const blockedUsers = await prisma.user.findMany({
        where: {
            authUserId: { in: blockedAuthUserIds
            }
        },
        select: {
            authUserId: true,
            name: true,
            email: true,
            isActive: true
        }
    });

    return blockedUsers;
};

//check block or not
const checkBlockService = async(senderAuthUserId, receiverAuthUserId) => {
    const receiverExists = await userExists(receiverAuthUserId)
    if (!receiverExists) {
        return true; // ❗ safest default → block
    }

    const blocked = await prisma.blockedUser.findFirst({
        where: {
            OR: [{
                    blockerAuthUserId: senderAuthUserId,
                    blockedAuthUserId: receiverAuthUserId
                },
                {
                    blockerAuthUserId: receiverAuthUserId,
                    blockedAuthUserId: senderAuthUserId
                }
            ]
        }
    })

    return !!blocked
}

const searchUserService = async(
    myAuthUserId,
    searchText,
    page = 1,
    limit = 20
) => {
    const skip = (page - 1) * limit;

    //users I blocked
    const blockedByMe = await prisma.blockedUser.findMany({
        where: {
            blockerAuthUserId: myAuthUserId
        },
        select: {
            blockedAuthUserId: true
        }
    })

    //users who blocked me 
    const blockedMe = await prisma.blockedUser.findMany({
        where: {
            blockedAuthUserId: myAuthUserId
        },
        select: {
            blockerAuthUserId: true
        }
    })

    const excludes = [
        myAuthUserId,
        ...blockedByMe.map(u => u.blockedAuthUserId),
        ...blockedMe.map(u => u.blockerAuthUserId)
    ]

    return prisma.user.findMany({
        where: {
            authUserId: { notIn: excludes },
            OR: [{
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
        },
        select: {
            authUserId: true,
            name: true,
            email: true,
            isActive: true,
            avtar:true,
            username: true
        },
        skip,
        take: limit
    })
}

module.exports = {
    createUserService,
    getMyProfileService,
    getUserProfileService,
    updateUserService,
    blockUserService,
    unblockService,
    blockListService,
    checkBlockService,
    searchUserService
}