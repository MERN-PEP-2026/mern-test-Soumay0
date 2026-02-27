const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Each project belongs to a user
    },
    name: {
      type: String,
      required: [true, "Please add a project name"],
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
