const mongoose = require("mongoose");

const lessonPartSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, default: "" },
    videos: [{ type: String }],
    images: [{ type: String }],
    files: [{ type: String }],
  },
  { _id: true }
);

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    importance: { type: String, default: "" },
    parts: [lessonPartSchema],
  },
  { timestamps: true }
);

lessonSchema.index({ subjectId: 1 });

module.exports = mongoose.model("Lesson", lessonSchema);
