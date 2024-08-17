const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Please enter Your Name"],
    },
    courseCode: {
      type: String, 
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    courseImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    totalReview: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
