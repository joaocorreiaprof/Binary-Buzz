const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  sendMessageToGlobalGroup: async (req, res) => {
    const { senderId, content } = req.body;

    if (!senderId || !content) {
      return res
        .status(400)
        .json({ message: "Sender ID and content are required" });
    }

    try {
      const globalGroup = await prisma.group.findFirst({
        where: { isGlobal: true },
      });

      if (globalGroup) {
        const newMessage = await prisma.message.create({
          data: {
            senderId: senderId,
            content: content,
            groupId: globalGroup.id,
          },
        });
        return res.status(201).json(newMessage);
      } else {
        return res.status(404).json({ message: "Global group not found" });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getMessagesFromGlobalGroup: async (req, res) => {
    try {
      const globalGroup = await prisma.group.findFirst({
        where: { isGlobal: true },
      });

      if (globalGroup) {
        const messages = await prisma.message.findMany({
          where: { groupId: globalGroup.id },
          orderBy: { createdAt: "asc" },
          include: {
            sender: true,
          },
        });
        return res.status(200).json(messages);
      } else {
        return res.status(404).json({ message: "Global group not found" });
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
