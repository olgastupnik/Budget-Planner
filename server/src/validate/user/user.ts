import Joi from "joi";

export const userSchema = Joi.object({
  id: Joi.string().required,
  avatar: Joi.string().required,
  budgetAmount: Joi.number(),

  firstName: Joi.string()
    .trim()
    .regex(/^[a-z ,.'-]+$/i)
    .message("First name must contains only letters")
    .min(4),

  lastName: Joi.string()
    .trim()
    .regex(/^[a-z ,.'-]+$/i)
    .message("Last name must contains only letters")
    .min(4),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});
