import HttpError from "../helpers/HttpError.js";

const isValidId = (req, res, next) => {
  const { id } = req.params;

  const isIdValid = /^\d+$/.test(id);

  if (!isIdValid) {
    return next(HttpError(400, `${id} is not a valid ID format`));
  }

  next();
};

export default isValidId;
