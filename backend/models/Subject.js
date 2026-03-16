const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

subjectSchema.index({ categoryIds: 1 });

module.exports = mongoose.model("Subject", subjectSchema);
