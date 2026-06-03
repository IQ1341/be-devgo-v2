import Project from "../project/project.model.js";

export const getOverview = async () => {
  const [
    totalProjects,
    planningProjects,
    onProgressProjects,
    completedProjects,
    latestProjects,
    upcomingDeadlines,
    serviceDistribution,
    averageProgressResult
  ] = await Promise.all([
    Project.countDocuments(),

    Project.countDocuments({
      status: "planning"
    }),

    Project.countDocuments({
      status: "on-progress"
    }),

    Project.countDocuments({
      status: "completed"
    }),

    Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "code title client status progress createdAt"
      ),

    Project.find({
      deadline: {
        $gte: new Date()
      }
    })
      .sort({
        deadline: 1
      })
      .limit(5)
      .select(
        "code title client deadline progress"
      ),

    Project.aggregate([
      {
        $group: {
          _id: "$service",
          count: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          service: "$_id",
          count: 1
        }
      }
    ]),

    Project.aggregate([
      {
        $group: {
          _id: null,
          averageProgress: {
            $avg: "$progress"
          }
        }
      }
    ])
  ]);

  return {
    stats: {
      totalProjects,
      planningProjects,
      onProgressProjects,
      completedProjects,
      averageProgress:
        averageProgressResult?.[0]
          ?.averageProgress || 0
    },

    latestProjects,

    upcomingDeadlines,

    serviceDistribution
  };
};