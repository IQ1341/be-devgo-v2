import Project from "./project.model.js";

/* =========================
   CREATE
========================= */
export const create = async (payload) => {
  return await Project.create(payload);
};

/* =========================
   FIND ALL (ADMIN)
   - support filter status
   - support search
========================= */
export const findAll = async (
  filter = {},
  options = {}
) => {
  const {
    page = 1,
    limit = 10,
    search,
    status
  } = options;

  const skip = (page - 1) * limit;

  // build dynamic filter
  const query = { ...filter };

  // filter status
  if (status) {
    query.status = status;
  }

  // search by code, title, client
  if (search) {
    query.$or = [
      {
        code: {
          $regex: search,
          $options: "i"
        }
      },
      {
        title: {
          $regex: search,
          $options: "i"
        }
      },
      {
        client: {
          $regex: search,
          $options: "i"
        }
      }
    ];
  }

  let mongoQuery = Project.find(query)
  .sort({ createdAt: -1 });

if (limit > 0) {
  mongoQuery = mongoQuery
    .skip(skip)
    .limit(limit);
}

const data = await mongoQuery;

  const total = await Project.countDocuments(query);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/* =========================
   FIND BY ID
========================= */
export const findById = async (id) => {
  return await Project.findById(id);
};

/* =========================
   FIND BY CODE (PUBLIC TRACKING)
========================= */
export const findByCode = async (code) => {
  return await Project.findOne({ code });
};

/* =========================
   UPDATE
========================= */
export const updateById = async (id, payload) => {
  return await Project.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true
    }
  );
};

/* =========================
   DELETE
========================= */
export const deleteById = async (id) => {
  return await Project.findByIdAndDelete(id);
};

export const getStats = async () => {
  const total = await Project.countDocuments();

  const completed =
    await Project.countDocuments({
      status: "completed"
    });

  const onProgress =
    await Project.countDocuments({
      status: "on-progress"
    });

  const planning =
    await Project.countDocuments({
      status: "planning"
    });

  const avgProgress = await Project.aggregate([
    {
      $group: {
        _id: null,
        avg: {
          $avg: "$progress"
        }
      }
    }
  ]);

  return {
    total,
    completed,
    onProgress,
    planning,
    avgProgress: Math.round(
      avgProgress[0]?.avg || 0
    )
  };
};