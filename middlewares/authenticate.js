import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../db/models/User.js";
import "dotenv/config";

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized")); // Немає права входу
    return;
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findByPk(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized"));
      return;
    }

    req.user = user;

    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};

export default authenticate;
