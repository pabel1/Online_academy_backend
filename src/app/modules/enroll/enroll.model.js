const mongoose = require("mongoose");

const EnrollSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    enrolledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: "pending"
    }
  },
  { timestamps: true, versionKey: false }
);

const Enroll = mongoose.model("Enroll", EnrollSchema);

module.exports = Enroll;
