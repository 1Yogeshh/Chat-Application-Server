const authService = require("../service/auth.service")

const register = async(req, res)=>{
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required",
            });
        }

        const user = await authService.register(email, password)

        res.status(201).json({
      message: "User registered successfully",
      user,
    });
    } catch (error) {
        res.status(400).json({
      message: error.message,
    });
    }
}

const getAllUsers = async (req, res) =>{
    try {
        const users = await authService.getAllUsers();
    res.json(users);
    } catch (error) {
        res.status(500).json({
      message: "Failed to fetch users",
    });
    }
}

module.exports = {register, getAllUsers}