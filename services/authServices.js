import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import sendEmail from "../helpers/sendEmail.js";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";

const { BASE_URL } = process.env;

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
    { s: "200", r: "pg", d: "retro" },
    true
  );
  const verificationToken = uuidv4();

  const newUser = await User.create({
    ...payload,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  try {
    const verifyEmail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);
  } catch (error) {
    await User.destroy({ where: { id: newUser.id } });
    throw error;
  }

  return newUser;
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
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

export async function verifyUserEmail(token) {
  const user = await User.findOne({ where: { verificationToken: token } });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await user.update({
    verify: true,
    verificationToken: null,
  });

  return user;
}

export async function resendVerifyEmail(email) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  return true;
}
