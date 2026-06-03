import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: "http://localhost:4321", // Astro
    credentials: true,
  })
);

// Parse Cookies
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
app.use(morgan("dev"));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

// API Routes
app.use("/api/v1", routes);

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

export default app;