const baseLogger = require("../config/logger")

const authLogger = baseLogger.child({
    module: "AUTH"
})

module.exports = authLogger