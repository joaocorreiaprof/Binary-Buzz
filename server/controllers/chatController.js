const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  sendIndividualMessage: async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res
        .status(400)
        .json({ message: "Sender ID, receiver ID and content are required" });
    }

    try {
      let conversation = await prisma.conversationUser.findFirst({
        where: {
          userId: senderId,
          conversation: {
            participants: {
              some: {
                userId: receiverId,
              },
            },
          },
        },
        include: {
          conversation: true,
        },
      });

      let newMessage;

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            messages: {
              create: {
                senderId,
                receiverId,
                content,
              },
            },
            participants: {
              create: [{ userId: senderId }, { userId: receiverId }],
            },
          },
          include: {
            messages: true,
          },
        });
        newMessage = conversation.messages[conversation.messages.length - 1];
      } else {
        newMessage = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            conversationId: conversation.conversationId,
            content,
          },
          include: {
            sender: true,
            receiver: true,
          },
        });
      }

      return res.status(201).json({
        message: "Message sent successfully",
        message: newMessage,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error sending message" });
    }
  },

  getMessagesForUser: async (req, res) => {
    const { senderId, receiverId } = req.params;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ message: "Sender ID and Receiver ID are required" });
    }

    try {
      let conversation = await prisma.conversation.findFirst({
        where: {
          participants: {
            every: {
              userId: { in: [senderId, receiverId] },
            },
          },
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      // If no conversation exists, create one
      if (!conversation) {
        console.log(
          `Conversation not found between ${senderId} and ${receiverId}, creating one...`
        );

        conversation = await prisma.conversation.create({
          data: {
            participants: {
              create: [
                { user: { connect: { id: senderId } } },
                { user: { connect: { id: receiverId } } },
              ],
            },
          },
          include: {
            messages: true,
          },
        });
      }

      return res.status(200).json({
        message: "Messages retrieved successfully",
        messages: conversation.messages,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error retrieving messages" });
    }
  },
};
