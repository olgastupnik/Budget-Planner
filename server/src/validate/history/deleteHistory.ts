import Joi from "joi";

export const deleteHistorySchema = Joi.object({
  ids: Joi.string(),
  deleteAll: Joi.string().valid("true", "false"),
  type: Joi.string().valid("income", "expense"),
}).or("ids", "deleteAll");

export const deleteHistoryAdminSchema = Joi.object({
  ids: Joi.array().items(Joi.string()),
  deleteAll: Joi.string().valid("true", "false"),
}).or("ids", "deleteAll");
