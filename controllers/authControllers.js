import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

export async function register(req, res, next) {
  try {
    const newUser = await authServices.registerUser(req.body);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const { token, user } = await authServices.loginUser(email, password);

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const { id } = req.user;

    await authServices.logoutUser(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAvatar(req, res, next) {
  try {
    if (!req.file) {
      throw HttpError(400, "Avatar file is required");
    }

    const { id } = req.user;

    const avatarURL = await authServices.updateUserAvatar(id, req.file);

    res.status(200).json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
}
