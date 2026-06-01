import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";
dotenv.config();

import Admin from "../modules/auth/auth.model.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    const existingAdmin =
      await Admin.findOne({
        username: "admin"
      });

    if (existingAdmin) {
      console.log(
        "Admin already exists"
      );

      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash(
        "admin123",
        10
      );

    await Admin.create({
      username: "admin",
      password: hashedPassword
    });

    console.log(
      "Admin created successfully"
    );

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }
};

createAdmin();