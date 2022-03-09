import Joi from "joi";

export const categorySchema = Joi.object({
  title: Joi.string().required(),

  description: Joi.string().min(3).required(),
});

export const categoryAdminSchema = Joi.object({
  title: Joi.string().min(3).required(),

  description: Joi.string().required(),

  is_default: Joi.bool().valid(true).required(),
});
