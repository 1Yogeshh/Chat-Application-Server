const {createUserService, getMyProfileService} = require("../services/user.service")

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

module.exports = {createUser, getMyProfile}
