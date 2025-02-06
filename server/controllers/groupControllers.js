const { PrismaClient } = require("@prisma/client");

module.exports = {
  sendMessageToGlobalGroup: async (req, res) => {
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
    }
  },

  getMessagesFromGlobalGroup: async (req, res) => {
    const globalGroup = await prisma.group.findFirst({
      where: { isGlobal: true },
    });
    if (globalGroup) {
      const messages = await prisma.message.findMany({
        where: { groupId: globalGroup.id },
        orderBy: { createdAt: "asc" },
      });
    }
  },
};
