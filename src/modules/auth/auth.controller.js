import * as service from "./auth.service.js";

export const login = async (
  req,
  res,
  next
) => {
  try {
    const {
      username,
      password
    } = req.body;

    const token =
      await service.login(
        username,
        password
      );

    res.cookie(
      "admin_token",
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000
      }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      token
    });

  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.json({
    success: true,
    message: "Logout berhasil",
  });
};
