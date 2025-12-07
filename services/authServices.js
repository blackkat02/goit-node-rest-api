import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import "dotenv/config";
import fs from "fs/promises";
import path from "path";

import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";

const { SECRET_KEY } = process.env;

export async function findUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

export async function registerUser(payload) {
  const { email, password } = payload;

  const user = await findUserByEmail(email);
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(
    email,
    {
      s: "200",
      r: "pg",
      d: "retro",
    },
    true
  );

  return await User.create({
    ...payload,
    password: hashPassword,
    avatarURL,
  });
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await user.update({ token });

  return { token, user };
}

export async function logoutUser(userId) {
  await User.update({ token: null }, { where: { id: userId } });
}

export async function updateUserAvatar(userId, file) {
  const { path: tempPath, originalname } = file;

  const extension = originalname.split(".").pop();
  const filename = `${userId}.${extension}`;

  const resultDir = path.resolve("public", "avatars");
  const resultUpload = path.join(resultDir, filename);

  await fs.rename(tempPath, resultUpload);

  const avatarURL = path.join("avatars", filename).replace(/\\/g, "/");

  const user = await User.findByPk(userId);
  await user.update({ avatarURL });

  return avatarURL;
}
