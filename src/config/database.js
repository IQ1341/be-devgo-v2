import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  try {
    console.log("Mongo URI:", env.mongoUri);

    await mongoose.connect(env.mongoUri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;