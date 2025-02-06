const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  signUp: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { email, username, password: hashedPassword },
      });

      const globalGroup = await prisma.group.findFirst({
        where: { isGlobal: true },
      });

      if (globalGroup) {
        await prisma.userGroup.create({
          data: {
            userId: newUser.id,
            groupId: globalGroup.id,
          },
        });
      }
      res.status(201).json(newUser);
    } catch (err) {
      console.error("Error creating user:", err);
      if (err.code === "P2002") {
        res.status(400).send("Email already exits");
      } else {
        res.status(500).send("An unexpected error occurred");
      }
    }
  },

  logIn: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).send("User not found");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send("Invalid credentials");
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user.id, email: user.email, username: user.username },
      });
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).send("An unexpected error occurred");
    }
  },

  displayAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (err) {
      console.error("Error fetching posts:", err);
      res.status(500).send("An unexpected error occured");
    }
  },
};
