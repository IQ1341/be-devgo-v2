import Project from "../project/project.model.js";

/* =========================
    GET PUBLISHED PROJECTS
======================== */
export const getPublishedProjects = async () => {
  const projects = await Project.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('title description website_url github_url service code createdAt');

  // Transform data untuk format portfolio sederhana
  const portfolioItems = projects.map(project => ({
    title: project.title,
    description: project.description,
    website_url: project.website_url,
    github_url: project.github_url,
    service: project.service,
    photo: `https://picsum.photos/seed/${project.code}/800/600`,
    code: project.code,
    createdAt: project.createdAt
  }));

  return {
    total: portfolioItems.length,
    data: portfolioItems
  };
};
