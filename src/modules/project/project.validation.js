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

  deadline: Joi.date().optional().allow(null, "")

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

  budget: Joi.number().allow(null),

  duration: Joi.number().allow(null)
});