import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    service: { type: String, default: "", trim: true },
    photo: { type: String, default: "", trim: true },
    website_url: { type: String, default: "", trim: true },
    github_url: { type: String, default: "", trim: true },
    isPublished: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

portfolioSchema.index({ isPublished: 1, createdAt: -1 });

export default mongoose.model("Portfolio", portfolioSchema);
