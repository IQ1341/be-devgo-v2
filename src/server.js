import app from "./app.js";
import connectDB from "./config/database.js";
import { env } from "./config/env.js";
import "dotenv/config";

console.log(process.env.MONGODB_URI);

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(
      `Server running on port ${env.port}`
    );
  });
};

startServer();