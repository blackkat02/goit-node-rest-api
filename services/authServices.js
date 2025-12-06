import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";
import "dotenv/config";

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

  return await User.create({
    ...payload,
    password: hashPassword,
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
