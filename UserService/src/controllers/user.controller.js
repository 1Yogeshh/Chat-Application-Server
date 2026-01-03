const {createUserService, 
  getMyProfileService, 
  getUserProfileService,
  updateUserService, 
  blockUserService,
  unblockService,
  blockListService,
  checkBlockService,
  searchUserService
} = require("../services/user.service")

const createUser = async(req, res)=>{
    const {authUserId, email} = req.user;
    const {name} = req.body

    if(!name || name.trim()===""){
        return res.status(400).json({
            message:"Name is required"
        })
    }

    const result = await createUserService({
        authUserId,
        email,
        name
    })

    if (result.alreadyExits) {
    return res.status(409).json({
      message: "User already exists",
      user: result.user
    });
  }

  return res.status(201).json({
    message: "User created successfully",
    user: result.user
  });
}

const getMyProfile = async(req, res)=>{
    const {authUserId} = req.user;

    const user = await getMyProfileService(authUserId)

    if(!user || !user.isActive){
      return res.status(404).json({
        message: "User not found or blocked"
      });
    }

    res.status(200).json(user);
}

const getUserProfile = async(req, res)=>{
  try {
    const profile = await getUserProfileService(
      req.user.authUserId,
      req.params.authUserId
    )

    res.status(200).json(profile)
  } catch (error) {
    res.status(403).json({message:err.message})
  }
}

const updateUser = async(req, res)=>{
  const {authUserId} = req.user;
  const {name} = req.body;

  if(!name || name.trim()===""){
        return res.status(400).json({
            message:"Name is required"
        })
  }

  const user = await updateUserService(authUserId, name);

  res.status(200).json({
    message:"profile updated successfully",
    user
  })
}

const blockUser = async(req, res)=>{
  try {
    const {authUserId} = req.user;
    await blockUserService(authUserId, req.params.blockedAuthUserId);

    res.status(200).json({message:"User blocked successfully"})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const unblockUser = async(req, res)=>{
  try {
    const {authUserId} = req.user;
    await unblockService(authUserId, req.params.blockedAuthUserId)

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
}

const blockList = async(req, res)=>{
  const {authUserId} = req.user;
  const list = await blockListService(authUserId)
  res.status(200).json(list)
}

const checkBlock = async(req, res)=>{
  const { receiverAuthUserId } = req.query;

  if (!receiverAuthUserId) {
    return res
      .status(400)
      .json({ message: "receiverAuthUserId required" });
  }

  const blocked = await checkBlockService(req.user.authUserId, receiverAuthUserId)

  res.status(200).json(blocked)
}

const searchUser = async(req, res)=>{
  const {q, page=1, limit=20} = req.query;

  if(!q || q.trim() === ""){
    return res.status(400).json({
      message:"Search query is required"
    })
  }

  const users = await searchUserService(
    req.user.authUserId,
    q.trim(),
    Number(page),
    Number((limit))
  )

  res.status(200).json(users);
}

module.exports = {
  createUser, 
  getMyProfile, 
  getUserProfile,
  updateUser, 
  blockUser, 
  blockList, 
  unblockUser, 
  checkBlock,
  searchUser
}
