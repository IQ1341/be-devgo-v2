import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    phase: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending"
    },
    date: Date
  },
  { _id: false }
);

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      default: "👤"
    }
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "other"
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    /* =========================
       IDENTITAS PROJECT
    ========================= */
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      immutable: true // 🔥 IMPORTANT: tidak bisa diubah
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    service: {
      type: String,
      default: "",
      trim: true
    },

    /* =========================
       CLIENT INFO
    ========================= */
    client: {
      type: String,
      required: true,
      trim: true
    },

    contact: {
      type: String,
      default: "",
      trim: true
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      default: "",
      trim: true
    },

    /* =========================
       PROJECT INFO
    ========================= */
    description: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["planning", "on-progress", "completed"],
      default: "planning",
      index: true // 🔥 untuk filter cepat
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    deadline: {
      type: Date,
      index: true
    },

    duration: {
      type: String,
      default: "0"
    },

    budget: {
      type: Number,
      default: 0
    },

    /* =========================
       VISIBILITY
    ========================= */
    isPublished: {
      type: Boolean,
      default: true,
      index: true
    },

    /* =========================
       RELATIONS
    ========================= */
    team_members: [teamMemberSchema],

    timeline: [timelineSchema],

    technologies: [
      {
        type: String,
        trim: true
      }
    ],

    documents: [documentSchema]
  },
  {
    timestamps: true
  }
);

/* =========================
   INDEX COMPOUND (IMPORTANT)
========================= */
// projectSchema.index({ code: 1 });
projectSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Project", projectSchema);