require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

//Routes
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const chatRoutes = require("./routes/chatRoutes");

//Middleware
const auth = require("./middlewares/auth");
app.use(express.json());

//App Uses
app.use("/api/users", userRoutes);
app.use("/api/groups", auth, groupRoutes);
app.use("/api/chats", auth, chatRoutes);

// Serve static files from the client/dist directory
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// Handle all other routes with the frontend's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
  console.log("Static files served from:", clientBuildPath);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
