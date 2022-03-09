import Joi from "joi";

export const updateByOwnerSchema = Joi.object({
  photo: Joi.string(),
  title: Joi.string().min(4).max(20),
  description: Joi.string().min(4).max(40),
  totalAmount: Joi.number().min(1),
  currentAmount: Joi.number().min(1).required(),
  id: Joi.string().required(),
});

export const updateFavoriteSchema = Joi.object({
  isFavorite: Joi.boolean().required(),
});

export const updateSchema = Joi.object({
  currentAmount: Joi.number().min(1).required(),
});
