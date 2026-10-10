import * as repository from "./project.repository.js";
import { generateProjectCode } from "../../utils/generateProjectCode.js";
import { randomBytes } from "node:crypto";

/* =========================
   CREATE FROM CLIENT (PUBLIC)
========================= */
export const createFromClient = async (payload) => {

  // auto generate code
  const code = generateProjectCode();

  const newProject = await repository.create({
    ...payload,
    code,
    source: "client",
    status: "planning",
    progress: 0
  });

  return newProject;
};

/* =========================
   CREATE FROM ADMIN (MANUAL)
========================= */
export const createFromAdmin = async (payload) => {

  const code = payload.code || generateProjectCode();

  const existing = await repository.findByCode(code);

  if (existing) {
    throw new Error("Project code already exists");
  }

  return await repository.create({
    ...payload,
    code,
    source: "admin"
  });
};

/* =========================
   GET ALL PROJECTS (ADMIN)
========================= */
export const getProjects = async (page, limit, search, status) => {
  return await repository.findAll(
    {},
    {
      page,
      limit,
      search,
      status
    }
  );
};

/* =========================
   GET BY ID
========================= */
export const getProjectById = async (id) => {
  const project = await repository.findById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

/* =========================
   GET BY CODE (PUBLIC TRACKING)
========================= */
export const getProjectByCode = async (code) => {
  const project = await repository.findByCode(code);

  if (!project) {
    throw new Error("Project not found");
  }

  const publicProject = project.toObject();
  delete publicProject.payments;
  delete publicProject.invoice;
  return publicProject;
};

/* =========================
   UPDATE PROJECT
========================= */
export const updateProject = async (id, payload) => {
  const current = await repository.findById(id);
  if (!current) throw new Error("Project not found");

  const safePayload = { ...payload };
  delete safePayload.budget_paid;
  delete safePayload.budget_dp;
  delete safePayload.budget_status;
  if (safePayload.budget !== undefined && Number(safePayload.budget) < Number(current.budget_paid || 0)) {
    throw new Error("Total budget tidak boleh lebih kecil dari pembayaran yang sudah diterima");
  }
  const nextBudget = safePayload.budget === undefined ? Number(current.budget || 0) : Number(safePayload.budget || 0);
  const paid = Number(current.budget_paid || 0);
  safePayload.budget_status = nextBudget > 0 && paid >= nextBudget ? "paid" : paid > 0 ? "dp" : "unpaid";

  const project = await repository.updateById(id, safePayload);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

/* =========================
   DELETE PROJECT
========================= */
export const deleteProject = async (id) => {
  const project = await repository.deleteByIdOrCode(id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const recordPayment = async (id, payload) => {
  const project = await repository.recordPayment(id, payload);
  if (!project) throw new Error("Project not found");
  return project;
};

export const issueInvoice = async (id, { dueDate, notes = "" }) => {
  const project = await repository.findById(id);
  if (!project) throw new Error("Project not found");
  if (!(Number(project.budget) > 0)) throw new Error("Tetapkan budget project sebelum menerbitkan invoice");
  if (project.invoice?.status === "issued") throw new Error("Invoice project ini sudah diterbitkan");

  const now = new Date();
  const month = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  project.invoice = {
    number: `INV-${month}-${randomBytes(4).toString("hex").toUpperCase()}`,
    issuedAt: now,
    dueDate: new Date(dueDate),
    notes,
    shareToken: randomBytes(32).toString("hex"),
    status: "issued"
  };
  await project.save();
  return project;
};

export const getPublicInvoice = async (token) => {
  const project = await repository.findByInvoiceToken(token);
  if (!project) throw new Error("Invoice tidak ditemukan atau sudah tidak aktif");

  const total = Number(project.budget || 0);
  const paid = Math.min(Number(project.budget_paid || 0), total);
  const remaining = Math.max(total - paid, 0);
  const dueDate = new Date(project.invoice.dueDate);
  const isOverdue = remaining > 0 && dueDate < new Date(new Date().setHours(0, 0, 0, 0));

  return {
    invoice: {
      number: project.invoice.number,
      issuedAt: project.invoice.issuedAt,
      dueDate: project.invoice.dueDate,
      notes: project.invoice.notes,
      status: remaining === 0 ? "paid" : isOverdue ? "overdue" : paid > 0 ? "partial" : "issued",
      total,
      paid,
      remaining,
      payments: (project.payments || []).map(({ amount, paidAt, method }) => ({ amount, paidAt, method }))
    },
    project: {
      title: project.title,
      client: project.client,
      service: project.service
    }
  };
};

export const getProjectStats = async () => {
  return repository.getStats();
};
