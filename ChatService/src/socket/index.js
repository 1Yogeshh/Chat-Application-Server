const { Server } = require("socket.io");

module.exports = (server) => {
        const io = new Server(server, {
                cors: {
                        origin: "*"
                }
        })

        io.on("connection", (socket) => {
                console.log("User connected:", socket.id);

                socket.on("disconnect", () => {
                        console.log("❌ Socket disconnected:", socket.id);
                });

        });
}