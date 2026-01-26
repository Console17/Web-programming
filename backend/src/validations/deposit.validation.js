import Joi from "joi";

const depositSchema = Joi.object({
  amount: Joi.number().greater(0).required(),
});

export default depositSchema;
