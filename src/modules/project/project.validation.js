import Joi from "joi";

/* =================================================
   CLIENT PUBLIC FORM (NO CODE)
================================================= */
export const createProjectClientSchema = Joi.object({
  title: Joi.string().required(),

  client: Joi.string().required(),

  service: Joi.string().allow(""),

  contact: Joi.string().allow(""),

  email: Joi.string().email().allow(""),

  phone: Joi.string().allow(""),

  description: Joi.string().allow(""),

  budget: Joi.number().allow(null),

  duration: Joi.number().allow(null),

  deadline: Joi.date().optional().allow(null, ""),

  budget_status: Joi.string()
    .valid("unpaid", "dp", "paid")
    .optional(),

  budget_paid: Joi.number().allow(null).default(0),

  budget_dp: Joi.number().allow(null).default(0),

  budget_notes: Joi.string().allow("")

});

/* =================================================
   ADMIN CREATE PROJECT (OPTIONAL CODE)
================================================= */
export const createProjectAdminSchema = Joi.object({
  code: Joi.string().optional(),

  title: Joi.string().required(),

  client: Joi.string().required(),

  service: Joi.string().allow(""),

  contact: Joi.string().allow(""),

  email: Joi.string().email().allow(""),

  phone: Joi.string().allow(""),

  description: Joi.string().allow(""),

  status: Joi.string()
    .valid("planning", "on-progress", "completed")
    .optional(),

  progress: Joi.number().min(0).max(100).optional(),

  budget: Joi.number().allow(null),

  duration: Joi.number().allow(null),

  deadline: Joi.date().optional().allow(null, ""),

  budget_status: Joi.string()
    .valid("unpaid", "dp", "paid")
    .optional(),

  budget_paid: Joi.number().allow(null).default(0),

  budget_dp: Joi.number().allow(null).default(0),

  budget_notes: Joi.string().allow("")
});
