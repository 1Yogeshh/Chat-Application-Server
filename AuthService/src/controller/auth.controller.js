const authService = require("../service/auth.service")

//register controller
const register = async(req, res)=>{
    try {
        const {email, password} = req.body;

        //check email or password is empty or not 
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

// get all users controller
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


//login controller
const login = async(req, res)=>{
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required",
            });
        }

        const data = await authService.login(email, password)

        res.status(201).json({
            message: "User login successfully",
            data,
        });

    } catch (error) {
        res.status(400).json({
            message: error.message,
        });  
    }
}

module.exports = {register, getAllUsers, login}