const request = require("supertest");
const app = require("../index");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Mock data for the test
const senderId = "d6a8fba3-b46a-4ecc-9c75-ee4f3691530a";
const receiverId = "1eaaf505-cd9b-4d18-a5a2-04a4ad7184f2";
const messageContent = "Hello! This is a test message.";

describe("Chat Controller Tests", () => {
  afterAll(async () => {
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
  });

  describe("GET /api/chats/messages/:senderId/:receiverId", () => {
    it("should return a 404 if no conversation exists between the sender and receiver", async () => {
      const response = await request(app).get(
        `/api/chats/messages/invalid-sender-id/invalid-receiver-id`
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Conversation not found");
    });

    it("should return a 400 if senderId or receiverId are missing", async () => {
      const response = await request(app).get(
        `/api/chats/messages/${senderId}/`
      );

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Sender ID and receiver ID are required"
      );
    });

    it("should return all messages between the sender and receiver", async () => {
      await prisma.conversation.deleteMany();

      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: senderId }, { userId: receiverId }],
          },
        },
      });

      console.log("Test conversation created:", conversation);

      await prisma.message.createMany({
        data: [
          {
            conversationId: conversation.id,
            senderId,
            receiverId,
            content: "Hello, this is the first message!",
          },
          {
            conversationId: conversation.id,
            senderId,
            receiverId,
            content: "And this is the second message!",
          },
        ],
      });

      const response = await request(app).get(
        `/api/chats/${senderId}/${receiverId}/messages`
      );

      console.log("Fetched messages response:", response.body);

      expect(response.status).toBe(200);
      expect(response.body.messages).toHaveLength(2); // Expecting two messages
      expect(response.body.messages[0].content).toBe(
        "Hello, this is the first message!"
      );
      expect(response.body.messages[1].content).toBe(
        "And this is the second message!"
      );
    });
  });

  describe("POST /api/chats/new-msg-ind", () => {
    it("should send an individual message successfully", async () => {
      await prisma.conversation.deleteMany();

      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: senderId }, { userId: receiverId }],
          },
        },
      });

      console.log("Test conversation created:", conversation);

      await prisma.message.createMany({
        data: [
          {
            conversationId: conversation.id,
            senderId,
            receiverId,
            content: "Hello, this is the first message!",
          },
          {
            conversationId: conversation.id,
            senderId,
            receiverId,
            content: "And this is the second message!",
          },
        ],
      });
      const response = await request(app)
        .post("/api/chats/new-msg-ind")
        .send({ senderId, receiverId, content: messageContent });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message.content).toBe(messageContent);
      expect(response.body.message.senderId).toBe(senderId);
      expect(response.body.message.receiverId).toBe(receiverId);
    });

    it("should return an error if required fields are missing", async () => {
      await prisma.conversation.deleteMany();

      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: senderId }, { userId: receiverId }],
          },
        },
      });

      console.log("Test conversation created:", conversation);

      await prisma.message.createMany({
        data: [
          {
            conversationId: conversation.id,
            senderId,
            receiverId,
            content: "Hello, this is the first message!",
          },
          {
            conversationId: conversation.id,
            senderId,
            receiverId,
            content: "And this is the second message!",
          },
        ],
      });

      const response = await request(app)
        .post("/api/chats/new-msg-ind")
        .send({ content: messageContent });

      expect(response.status).toBe(400); // Bad request for missing fields
      expect(response.body.message).toBe(
        "Sender ID, receiver ID and content are required"
      );
    });
  });
});
