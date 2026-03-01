const baseLogger = require("../config/logger")

const chatLogger = baseLogger.child({
    module: "CHAT"
})

module.exports = chatLogger