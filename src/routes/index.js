import express from "express";

import projectRoutes from "../modules/project/project.route.js";
import authRoutes from "../modules/auth/auth.route.js";

const router =
  express.Router();

router.use(
  "/projects",
  projectRoutes
);

router.use(
  "/auth",
  authRoutes
);

export default router;