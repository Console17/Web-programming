import Joi from "joi";

const signUpSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  role: Joi.string().valid("seller", "user", "admin").lowercase().required(),
});

export default signUpSchema;
