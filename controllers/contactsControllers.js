import * as contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const result = await contactsServices.listContacts(owner);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const getOneContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { id } = req.params;

    const result = await contactsServices.getContactById(id, owner);

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { id } = req.params;

    const result = await contactsServices.removeContact(id, owner);

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;

    const result = await contactsServices.addContact({ ...req.body, owner });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { id } = req.params;

    const result = await contactsServices.updateContactById(
      id,
      owner,
      req.body
    );

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { id } = req.params;

    const result = await contactsServices.updateContactById(
      id,
      owner,
      req.body
    );

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
