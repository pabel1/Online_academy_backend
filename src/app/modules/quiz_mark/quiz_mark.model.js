const mongoose = require("mongoose");

const QuizMarkSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const QuizMark = mongoose.model("QuizMark", QuizMarkSchema);

module.exports = QuizMark;
