import Joi from "joi";

export const deleteCategoryAdminSchema = Joi.object({
  ids: Joi.array().items(Joi.string()),
  clear: Joi.string().valid("true"),
}).or("ids", "clear");

export const deleteCategorySchema = Joi.object({
  id: Joi.string(),
  clear: Joi.string().valid("true"),
}).or("id", "clear");
