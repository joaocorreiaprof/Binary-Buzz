const express = require("express");
const {
  signUp,
  logIn,
  displayAllUsers,
} = require("../controllers/userControllers");
const router = express.Router();

router.post("/sign-up", signUp);
router.post("/log-in", logIn);
router.get("/display-all", displayAllUsers);

module.exports = router;
