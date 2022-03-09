import Joi from "joi";

export const communalSchema = Joi.object({
  timestamp: Joi.date(),

  bills: Joi.object({
    water: Joi.number(),
    heating: Joi.number(),
    gas: Joi.number(),
  }),

  total: Joi.number().required(),
  id: Joi.string(),
});
