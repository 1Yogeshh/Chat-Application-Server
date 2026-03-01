const baseLogger = require("../config/logger")

const userLogger = baseLogger.child({
    module: "USER"
})

module.exports = userLogger