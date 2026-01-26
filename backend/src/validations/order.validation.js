import Joi from "joi";

export const updateOrderItemStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Processing", "Shipped", "Delivered", "Cancelled")
    .required(),
});
