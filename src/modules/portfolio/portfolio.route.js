import express from "express";

import { getPublicPortfolio } from "./portfolio.controller.js";

const router = express.Router();

/* =========================
    PUBLIC PORTFOLIO ROUTES
======================== */

// Get all published projects for portfolio
router.get(
  "/public-portfolio",
  getPublicPortfolio
);

export default router;
