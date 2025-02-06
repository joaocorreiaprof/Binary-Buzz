const express = require("express");
const {
  sendMessageToGlobalGroup,
  getMessagesFromGlobalGroup,
} = require("../controllers/groupControllers");
const router = express.Router();

router.post("/new-msg-global", sendMessageToGlobalGroup);
router.get("/msg-global", getMessagesFromGlobalGroup);

module.exports = router;
