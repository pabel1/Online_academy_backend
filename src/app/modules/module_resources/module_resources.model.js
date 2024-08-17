const mongoose = require("mongoose");

const ModuleResourcesSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModule",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    yt_link: {
      type: String,
    },
    git_link: {
      type: String,
    },
    resourceImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    content: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const ModuleResources = mongoose.model(
  "ModuleResources",
  ModuleResourcesSchema
);

module.exports = ModuleResources;
