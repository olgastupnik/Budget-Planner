import Joi from "joi";

import { PASSWORD_REGEXP } from "../../constants";

export const passwordSchema = Joi.object({
  password: Joi.string().pattern(new RegExp(PASSWORD_REGEXP)).min(6).required(),

  repeatedPassword: Joi.string()
    .pattern(new RegExp(PASSWORD_REGEXP))
    .min(6)
    .required(),
});
