
import mongoose from "mongoose";
import { env } from "./env.js";

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!env.mongoUri) {
    throw new Error("MONGODB_URI belum dikonfigurasi");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongoUri)
      .then(() => {
        console.log("MongoDB Connected");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;

