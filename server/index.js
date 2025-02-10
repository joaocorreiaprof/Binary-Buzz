require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

//Routes
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const chatRoutes = require("./routes/chatRoutes");

//Middleware
const auth = require("./middlewares/auth");
app.use(cors()); //delete in production
app.use(express.json());

//App Uses
app.use("/api/users", userRoutes);
app.use("/api/groups", auth, groupRoutes);
app.use("/api/chats", auth, chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
