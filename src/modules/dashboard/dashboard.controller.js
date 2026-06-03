import * as service from "./dashboard.service.js";

export const getOverview =
  async (
    req,
    res,
    next
  ) => {
    try {

      const result =
        await service.getOverview();

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      next(error);
    }
  };