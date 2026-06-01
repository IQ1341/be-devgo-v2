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

  const data = await Project.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

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