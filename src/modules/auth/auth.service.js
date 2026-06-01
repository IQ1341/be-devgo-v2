import bcrypt
from "bcryptjs";

import jwt
from "jsonwebtoken";

import * as repository
from "./auth.repository.js";

export const login =
async (
  username,
  password
) => {

  const admin =
    await repository.findByUsername(
      username
    );

  if (!admin) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const isMatch =
    await bcrypt.compare(
      password,
      admin.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const token =
    jwt.sign(
      {
        id: admin._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

  return {
    token
  };
};