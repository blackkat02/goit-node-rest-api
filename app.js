import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import connectDB from "./db/connectDB.js";
import { initAssociations } from "./db/associations.js";

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

import User from "./db/models/User.js";
import Contact from "./db/models/Contacts.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next(err);
});

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const startServer = async () => {
  try {
    await connectDB();

    await User.sync({ alter: true });
    await Contact.sync({ alter: true });

    initAssociations();

    const { PORT = 3000 } = process.env;

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
