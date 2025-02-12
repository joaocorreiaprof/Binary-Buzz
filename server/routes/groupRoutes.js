const express = require("express");
const {
  sendMessageToGlobalGroup,
  getMessagesFromGlobalGroup,
  createGroup,
  displayAllGroups,
  sendMessageToSpecificGroup,
  displayAllGroupSpecificMessages,
} = require("../controllers/groupControllers");
const router = express.Router();

//Global group
router.post("/new-msg-global", sendMessageToGlobalGroup);
router.get("/msg-global", getMessagesFromGlobalGroup);

//Create display groups
router.post("/create-group", createGroup);
router.get("/all-groups", displayAllGroups);
//Groups
router.post("/new-msg-group/:groupId", sendMessageToSpecificGroup);
router.get("/msg-group/:groupId", displayAllGroupSpecificMessages);

module.exports = router;
