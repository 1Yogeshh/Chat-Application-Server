const createUserService = require("../services/user.service")

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

    if (result.alreadyExists) {
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

module.exports = createUser
