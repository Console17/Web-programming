import Joi from "joi";

export const createProductSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
});

export const updateProductSchema = Joi.object({
  title: Joi.string(),
  category: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
});
