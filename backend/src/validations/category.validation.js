import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1),
  active: Joi.boolean(),
});
