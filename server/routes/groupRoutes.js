const express = require("express");
const {
  sendMessageToGlobalGroup,
  getMessagesFromGlobalGroup,
  createGroup,
  displayAllGroups,
} = require("../controllers/groupControllers");
const router = express.Router();

router.post("/new-msg-global", sendMessageToGlobalGroup);
router.get("/msg-global", getMessagesFromGlobalGroup);
router.post("/create-group", createGroup);
router.get("/all-groups", displayAllGroups);

module.exports = router;
