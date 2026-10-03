import * as service from "./portfolio.service.js";

/* =========================
    GET ALL PUBLISHED PROJECTS
    ========================= */
export const getPublicPortfolio = async (req, res, next) => {
  try {
    const result = await service.getPublishedProjects();

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    next(error);
  }
};
