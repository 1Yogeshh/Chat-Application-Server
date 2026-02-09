const axios = require("axios");

const CHAT_SERVICE = process.env.CHAT_SERVICE;
const USER_SERVICE = process.env.USER_SERVICE;

const getComposedChats = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", req.headers.authorization);

    // 1️⃣ Chat service se chats
    const chatRes = await axios.get(
      `${CHAT_SERVICE}/chats`,
      { headers: { Authorization: authHeader } }
    );

    const chats = chatRes.data.chats;

    if (!chats || chats.length === 0) {
      return res.json([]);
    }

    // ⚠️ authUserId middleware se aana best hota hai
    const myUserId = req.user.authUserId;
    console.log(myUserId)
    if (!myUserId) {
      return res.status(401).json({ message: "User id missing" });
    }

    // 2️⃣ other userIds nikalo
    const userIds = [
      ...new Set(
        chats.flatMap(chat =>
          chat.participants
            .map(p => p.userId)
            .filter(id => id !== myUserId)
        )
      )
    ];

    // 3️⃣ batch user fetch
    const userRes = await axios.post(
      `${USER_SERVICE}/batch`,
      { ids: userIds },
      { headers: { Authorization: authHeader } }
    );

    const usersMap = userRes.data;

    // 4️⃣ merge
    const finalChats = chats.map(chat => {
      const otherUserId =
        chat.participants.find(p => p.userId !== myUserId)?.userId;

      return {
        id: chat.id,
        otherUser: usersMap[otherUserId] || null,
        lastMessage: chat.message?.[0] ?? null
      };
    });

    res.json(finalChats);
  } catch (err) {
    console.error("Gateway chat error:", err.message);
    res.status(500).json({ message: "Failed to load chats" });
  }
};

module.exports = { getComposedChats };
