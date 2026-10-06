import Joi from "joi";

export const recordPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  paidAt: Joi.date().optional(),
  method: Joi.string().trim().max(60).allow("").optional(),
  note: Joi.string().trim().max(300).allow("").optional()
});

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

  budget_notes: Joi.string().allow("")
});
