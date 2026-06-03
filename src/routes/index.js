import express from "express";

import projectRoutes from "../modules/project/project.route.js";
import authRoutes from "../modules/auth/auth.route.js";
import dashboardRoutes from "../modules/dashboard/dashboard.route.js";

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

router.use(
  "/dashboard",
  dashboardRoutes
);



export default router;