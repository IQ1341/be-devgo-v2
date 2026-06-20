import express from "express";

import {
  createFromClient,
  createFromAdmin,
  getProjects,
  getProjectById,
  getProjectByCode,
  updateProject,
  updateBudgetStatus,
  deleteProject,
  getProjectStats
} from "./project.controller.js";

import { validate } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";

import {
  createProjectClientSchema,
  createProjectAdminSchema
} from "./project.validation.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

// Client submit form
router.post(
  "/public/create",
  validate(createProjectClientSchema),
  createFromClient
);

// Tracking project by code
router.get(
  "/code/:code",
  getProjectByCode
);

/* =========================
   ADMIN ROUTES
========================= */

// Get all projects
router.get(
  "/",
  auth,
  getProjects
);

router.get(
  "/stats",
  auth,
  getProjectStats
);

// Get by ID
router.get(
  "/:id",
  auth,
  getProjectById
);

// Admin create manual project
router.post(
  "/",
  auth,
  validate(createProjectAdminSchema),
  createFromAdmin
);

// Update project
router.put(
  "/:id",
  auth,
  updateProject
);

// Delete project
router.delete(
  "/:id",
  auth,
  deleteProject
);

// Update budget status
router.patch(
  "/:id/budget-status",
  auth,
  updateBudgetStatus
);

export default router;