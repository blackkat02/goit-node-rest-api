import express from "express";

import {
  register,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/authControllers.js";
import {
  registerSchema,
  loginSchema,
  emailSchema,
} from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.post("/logout", authenticate, logout);

authRouter.get("/current", authenticate, getCurrentUser);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

authRouter.get("/verify/:verificationToken", verifyEmail);

authRouter.post("/verify", validateBody(emailSchema), resendVerifyEmail);

export default authRouter;
