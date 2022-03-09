import Joi from "joi";

export const createHistorySchema = Joi.object({
  amount: Joi.number().required(),

  type: Joi.string().required(),

  category: Joi.string().required(),
});
