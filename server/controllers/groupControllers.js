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

  createGroup: async (req, res) => {
    const { name } = req.body;

    try {
      const existingGroup = await prisma.group.findUnique({
        where: {
          name: name,
        },
      });
      if (existingGroup) {
        return res.status(400).json({ message: "This group already exists" });
      }

      const newGroup = await prisma.group.create({
        data: {
          name: name,
          isGlobal: false,
        },
      });
      res.status(201).json(newGroup);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the group" });
    }
  },

  displayAllGroups: async (req, res) => {
    try {
      const groups = await prisma.group.findMany({
        where: {
          isGlobal: false,
        },
      });
      res.status(200).json(groups);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while retrieving groups" });
    }
  },
};
