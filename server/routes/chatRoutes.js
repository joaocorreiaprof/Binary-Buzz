const express = require("express");
const {
  sendIndividualMessage,
  getMessagesForUser,
} = require("../controllers/chatController");
const router = express.Router();

router.post("/new-msg-ind", sendIndividualMessage);
router.get("/:senderId/:receiverId/messages", getMessagesForUser);

module.exports = router;
