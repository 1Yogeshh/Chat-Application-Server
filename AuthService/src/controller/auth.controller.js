const authService = require("../service/auth.service")
const refreshTokenService = require("../service/refreshToken.service")
const logoutService = require("../service/logout.service")

const isProduction = process.env.NODE_ENV === "production";

//register controller
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

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
const getAllUsers = async (req, res) => {
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
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required",
            });
        }

        const { safeUser, accessToken, refreshToken } = await authService.login(email, password)

        // res.cookie("refreshToken", refreshToken,{
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000,
        // })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,                 // 🔥 true in production
            sameSite: isProduction ? "None" : "Lax", // 🔥 NONE for cross-site
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "User login successfully",
            user: safeUser,
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        const { newAccessToken, newRefreshToken } = await refreshTokenService(token)

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

const logout = async (req, res) => {
    await logoutService(req.cookies.refreshToken)
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
}

module.exports = { register, getAllUsers, login, refreshToken, logout }