const baseLogger = require("../../config/logger")

const authLogger = baseLogger.child({
    module: "USER"
})

module.exports = authLogger