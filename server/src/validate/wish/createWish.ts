import Joi from "joi";

export const createWishSchema = Joi.object({
  photo: Joi.string().default(null),
  title: Joi.string().min(4).max(20).required(),
  description: Joi.string().min(4).max(40).required(),
  isFavorite: Joi.boolean().default(false),
  totalAmount: Joi.number().min(1).required(),
});

export const connectWishSchema = Joi.object({
  wishId: Joi.string().required(),
});
