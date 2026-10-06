import express from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import {
  createPortfolioItem,
  deletePortfolioItem,
  getPortfolioItems,
  getPublicPortfolio,
  updatePortfolioItem
} from "./portfolio.controller.js";
import { portfolioSchema } from "./portfolio.validation.js";

const router = express.Router();

router.get("/public-portfolio", getPublicPortfolio);
router.get("/", auth, getPortfolioItems);
router.post("/", auth, validate(portfolioSchema), createPortfolioItem);
router.put("/:id", auth, validate(portfolioSchema), updatePortfolioItem);
router.delete("/:id", auth, deletePortfolioItem);

export default router;
