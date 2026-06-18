import * as repository from "./project.repository.js";
import { generateProjectCode } from "../../utils/generateProjectCode.js";

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

  return project;
};

/* =========================
   UPDATE PROJECT
========================= */
export const updateProject = async (id, payload) => {
  const project = await repository.updateById(id, payload);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

/* =========================
   DELETE PROJECT
========================= */
export const deleteProject = async (id) => {
  const project = await repository.deleteById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const getProjectStats = async () => {
  return repository.getStats();
};