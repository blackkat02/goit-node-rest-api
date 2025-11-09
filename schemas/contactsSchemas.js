import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().min(7).max(20).required(),
})

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string().min(7).max(20),
}).or('name', 'email', 'phone').options({ allowUnknown: false });

