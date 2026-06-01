import * as service
from "./auth.service.js";

export const login =
async (
  req,
  res,
  next
) => {

  try {

    const {
      username,
      password
    } = req.body;

    const result =
      await service.login(
        username,
        password
      );

    res.json({
      success: true,
      data: result
    });

  } catch (error) {

    next(error);

  }
};