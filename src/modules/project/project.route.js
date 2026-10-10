import express from "express";

import {
  createFromClient,
  createFromAdmin,
  getProjects,
  getProjectById,
  getProjectByCode,
  updateProject,
  recordPayment,
  deleteProject,
  getProjectStats,
  issueInvoice,
  getPublicInvoice
} from "./project.controller.js";

import { validate } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";

import {
  createProjectClientSchema,
  createProjectAdminSchema,
  recordPaymentSchema,
  issueInvoiceSchema
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

router.get("/invoice/:token", getPublicInvoice);

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

router.post("/:id/payments", auth, validate(recordPaymentSchema), recordPayment);
router.post("/:id/invoice", auth, validate(issueInvoiceSchema), issueInvoice);

export default router;
