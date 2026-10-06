import Portfolio from "./portfolio.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const getPublishedPortfolio = async () => {
  const data = await Portfolio.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .lean();

  return { total: data.length, data };
};

export const getPortfolioItems = async () => {
  return Portfolio.find().sort({ createdAt: -1 }).lean();
};

export const createPortfolioItem = async (payload) => {
  return Portfolio.create(payload);
};

export const updatePortfolioItem = async (id, payload) => {
  const item = await Portfolio.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  });

  if (!item) throw new ApiError(404, "Portfolio item not found");
  return item;
};

export const deletePortfolioItem = async (id) => {
  const item = await Portfolio.findByIdAndDelete(id);
  if (!item) throw new ApiError(404, "Portfolio item not found");
  return item;
};
