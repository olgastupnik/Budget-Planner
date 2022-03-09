import Joi from "joi";

import { ROLES_TYPE } from "../../constants";

export const registrSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .regex(/^[a-z ,.'-]+$/i)
    .message("First name must contains only letters")
    .min(4)
    .required(),

  lastName: Joi.string()
    .trim()
    .regex(/^[a-z ,.'-]+$/i)
    .message("Last name must contains only letters")
    .min(4)
    .required(),

  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  role: Joi.string()
    .valid(ROLES_TYPE.USER, ROLES_TYPE.ADMIN)
    .default(ROLES_TYPE.USER),
});
