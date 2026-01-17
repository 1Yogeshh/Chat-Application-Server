const { Server } = require("socket.io");
const auth = require("./socket.auth")
const handlers = require("./socket.handlers")
const subscribe = require("./socket.subscriber")

module.exports = async (server) => {
        const io = new Server(server, {
                cors: {
                        origin: "*"
                }
        })

        io.use(auth)

        io.on("connection", (socket) => {
                handlers(socket)
                console.log("User connected:", socket.id);
                console.log("✅ User connected:", socket.user.authUserId);
                console.log("✅ User connected:", socket.user.email);

                socket.on("disconnect", () => {
                        console.log("❌ Socket disconnected:", socket.id);
                });

        });

        await subscribe(io)
}