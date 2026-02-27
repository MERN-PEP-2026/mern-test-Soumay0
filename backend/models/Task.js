const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project", // Each task belongs to a project
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // The user who created the task
    },
    title: {
      type: String,
      required: [true, "Please add a task title"],
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
