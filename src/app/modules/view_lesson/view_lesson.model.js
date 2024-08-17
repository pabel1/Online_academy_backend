const mongoose = require("mongoose");

const ViewLessonSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const ViewLesson = mongoose.model("ViewLesson", ViewLessonSchema);

module.exports = ViewLesson;
