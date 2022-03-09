import Joi from "joi";

export const getWishesSchema = Joi.object({
  byOwner: Joi.string().valid("true", "false"),
  getAll: Joi.string().valid("true"),
}).or("byOwner", "getAll");
