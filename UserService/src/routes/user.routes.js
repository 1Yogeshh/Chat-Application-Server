const express = require("express")
const router = express.Router()
const protect = require("../middleware/userMiddleware")
const {
    createUser,
    getMyProfile,
    getUserProfile,
    updateUser,
    searchUser,
    getUsersByIds
} = require("../controllers/user.controller")
const {
    createUserSchema,
    updateUserSchema,
    searchUserSchema
} = require("../validators/user.schema")
const validate = require("../middleware/validate.middleware")


router.post("/create", protect, validate(createUserSchema), createUser)
router.get("/myprofile", protect, getMyProfile)
router.get("/userProfile/:authUserId", protect, getUserProfile)
router.put("/update", protect, validate(updateUserSchema), updateUser)
router.get("/search", protect, validate(searchUserSchema, "query"), searchUser)
router.post("/batch", protect, getUsersByIds)

module.exports = router