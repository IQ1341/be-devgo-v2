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
        secure: false, // true jika HTTPS
        sameSite: "lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000
      }
    );

    res.json({
      success: true,
      message: "Login berhasil"
    });

  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.json({
    success: true,
    message: "Logout berhasil",
  });
};