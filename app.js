import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import connectDB from "./db/connectDB.js";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

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

    const { PORT = 3000 } = process.env;

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Помилка при запуску сервера:", error);
    process.exit(1);
  }
};

startServer();
