const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    yt_link: {
      type: String,
      required: true,
    },
    git_link: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    lessonImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
