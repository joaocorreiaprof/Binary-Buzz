require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

//Routes
const userRoutes = require("./routes/userRoutes");

//Middleware
app.use(cors()); //delete in production
app.use(express.json());

//Sample route(check if possible to eleminate)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//App Uses
app.use(
  "/api/users",
  (req, res, next) => {
    console.log(`Received request at ${req.method} ${req.url}`);
    next();
  },
  userRoutes
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
