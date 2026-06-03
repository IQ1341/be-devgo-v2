import express from "express";

import { auth } from "../../middlewares/auth.middleware.js";

import {
  getOverview
} from "./dashboard.controller.js";

const router = express.Router();

router.get(
  "/overview",
  auth,
  getOverview
);

export default router;