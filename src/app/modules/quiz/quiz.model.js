const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;
