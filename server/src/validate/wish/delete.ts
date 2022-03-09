import { Joi } from "koa-joi-router";

export const deleteSchema = Joi.object({
  wishId: Joi.string().required(),
});
