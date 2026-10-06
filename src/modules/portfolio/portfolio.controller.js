import * as service from "./portfolio.service.js";

export const getPublicPortfolio = async (req, res, next) => {
  try {
    res.json({ success: true, ...(await service.getPublishedPortfolio()) });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioItems = async (req, res, next) => {
  try {
    res.json({ success: true, data: await service.getPortfolioItems() });
  } catch (error) {
    next(error);
  }
};

export const createPortfolioItem = async (req, res, next) => {
  try {
    const data = await service.createPortfolioItem(req.body);
    res.status(201).json({ success: true, message: "Portfolio item created", data });
  } catch (error) {
    next(error);
  }
};

export const updatePortfolioItem = async (req, res, next) => {
  try {
    const data = await service.updatePortfolioItem(req.params.id, req.body);
    res.json({ success: true, message: "Portfolio item updated", data });
  } catch (error) {
    next(error);
  }
};

export const deletePortfolioItem = async (req, res, next) => {
  try {
    await service.deletePortfolioItem(req.params.id);
    res.json({ success: true, message: "Portfolio item deleted" });
  } catch (error) {
    next(error);
  }
};
