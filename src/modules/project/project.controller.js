import * as service from "./project.service.js";

/* =========================
   PUBLIC - CLIENT CREATE
========================= */
export const createFromClient = async (req, res, next) => {
  try {
    const result = await service.createFromClient(req.body);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   ADMIN - CREATE MANUAL
========================= */
export const createFromAdmin = async (req, res, next) => {
  try {
    const result = await service.createFromAdmin(req.body);

    res.status(201).json({
      success: true,
      message: "Project created by admin",
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL PROJECTS (ADMIN)
========================= */
export const getProjects = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 4;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const status = req.query.status;

    const result = await service.getProjects(
      page,
      limit,
      search,
      status
    );

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res) => {
  const projects = await Project.find()
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    total: projects.length,
    data: projects
  });
};

/* =========================
   GET BY ID
========================= */
export const getProjectById = async (req, res, next) => {
  try {
    const result = await service.getProjectById(req.params.id);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   GET BY CODE (PUBLIC TRACKING)
========================= */
export const getProjectByCode = async (req, res, next) => {
  try {
    const result = await service.getProjectByCode(req.params.code);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE PROJECT (ADMIN)
========================= */
export const updateProject = async (req, res, next) => {
  try {
    const result = await service.updateProject(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Project updated successfully",
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE PROJECT (ADMIN)
========================= */
export const deleteProject = async (req, res, next) => {
  try {
    await service.deleteProject(req.params.id);

    res.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

export const getProjectStats = async (
  req,
  res,
  next
) => {
  try {
    const stats =
      await service.getProjectStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};