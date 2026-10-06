import Joi from "joi";

const optionalUrl = Joi.string()
  .uri({ scheme: ["http", "https"] })
  .allow("");

export const portfolioSchema = Joi.object({
  title: Joi.string().trim().min(1).max(160).required(),
  description: Joi.string().allow("").max(3000).optional(),
  service: Joi.string().allow("").max(100).optional(),
  photo: optionalUrl.optional(),
  website_url: optionalUrl.optional(),
  github_url: optionalUrl.optional(),
  isPublished: Joi.boolean().optional()
});
