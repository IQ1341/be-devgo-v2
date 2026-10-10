import Project from "./project.model.js";
import mongoose from "mongoose";

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

export const findByInvoiceToken = async (token) => {
  return await Project.findOne({ "invoice.shareToken": token, "invoice.status": "issued" });
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

export const deleteByIdOrCode = async (identifier) => {
  if (/^[a-f\d]{24}$/i.test(identifier) && mongoose.Types.ObjectId.isValid(identifier)) {
    return await Project.findByIdAndDelete(identifier);
  }

  return await Project.findOneAndDelete({ code: identifier });
};

export const recordPayment = async (id, payment) => {
  const project = await Project.findById(id);
  if (!project) return null;

  const amount = Number(payment.amount);
  const budget = Number(project.budget || 0);
  const alreadyPaid = Number(project.budget_paid || 0);
  const remaining = Math.max(budget - alreadyPaid, 0);
  if (budget <= 0) throw new Error("Tetapkan total budget project sebelum mencatat pembayaran");
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Jumlah pembayaran harus lebih dari 0");
  if (amount > remaining) throw new Error("Pembayaran melebihi sisa tagihan");

  project.payments.push(payment);
  project.budget_paid = alreadyPaid + amount;
  project.budget_status = project.budget_paid >= budget
    ? "paid"
    : project.budget_paid > 0 ? "dp" : "unpaid";
  return project.save();
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

  // Budget tracking stats
  const budgetStats = await Project.aggregate([
    { $project: {
      budget: { $ifNull: ["$budget", 0] },
      paid: { $ifNull: ["$budget_paid", 0] },
      status: { $switch: {
        branches: [
          { case: { $and: [{ $gt: [{ $ifNull: ["$budget", 0] }, 0] }, { $gte: [{ $ifNull: ["$budget_paid", 0] }, { $ifNull: ["$budget", 0] }] }] }, then: "paid" },
          { case: { $gt: [{ $ifNull: ["$budget_paid", 0] }, 0] }, then: "dp" }
        ],
        default: "unpaid"
      } }
    } },
    { $group: {
      _id: "$status", count: { $sum: 1 }, totalBudget: { $sum: "$budget" },
      totalPaid: { $sum: "$paid" }, totalPending: { $sum: { $max: [{ $subtract: ["$budget", "$paid"] }, 0] } }
    } }
  ]);

  const unpaidProjects = budgetStats.find(s => s._id === "unpaid") || { count: 0, totalBudget: 0, totalPaid: 0, totalPending: 0 };
  const dpProjects = budgetStats.find(s => s._id === "dp") || { count: 0, totalBudget: 0, totalPaid: 0, totalPending: 0 };
  const paidProjects = budgetStats.find(s => s._id === "paid") || { count: 0, totalBudget: 0, totalPaid: 0, totalPending: 0 };

  const totalUnpaidBudget = unpaidProjects.totalPending;
  const totalDPBudget = dpProjects.totalPending;
  const totalPaidBudget = paidProjects.totalPaid;
  const totalCollectedBudget = unpaidProjects.totalPaid + dpProjects.totalPaid + totalPaidBudget;
  const totalPendingBudget = totalUnpaidBudget + totalDPBudget + paidProjects.totalPending;

  return {
    total,
    completed,
    onProgress,
    planning,
    avgProgress: Math.round(
      avgProgress[0]?.avg || 0
    ),
    budget: {
      unpaid: {
        count: unpaidProjects.count,
        total: unpaidProjects.totalBudget,
        collected: unpaidProjects.totalPaid,
        pending: totalUnpaidBudget
      },
      dp: {
        count: dpProjects.count,
        total: dpProjects.totalBudget,
        collected: dpProjects.totalPaid,
        pending: totalDPBudget
      },
      paid: {
        count: paidProjects.count,
        total: paidProjects.totalBudget,
        collected: paidProjects.totalPaid,
        pending: paidProjects.totalPending
      },
      totalCollected: totalCollectedBudget,
      totalPending: totalPendingBudget,
      totalBudget: unpaidProjects.totalBudget + dpProjects.totalBudget + paidProjects.totalBudget
    }
  };
};
