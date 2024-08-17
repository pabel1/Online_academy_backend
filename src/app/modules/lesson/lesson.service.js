const { default: mongoose } = require("mongoose");
const ApiError = require("../../../errors/apiError");
const CourseModule = require("../course_module/course_module.model");
const Lesson = require("./lesson.model");

const createLessonService = async (payload, imageData, session) => {
  const requiredFields = [
    "moduleId",
    "courseId",
    "yt_link",
    "title",
    "description",
  ];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistModule = await CourseModule.findById(payload.moduleId);
  if (!isExistModule) {
    throw new ApiError(404, "Module not found");
  }

  const newData = {
    ...payload,
  };

  if (imageData) {
    newData.lessonImage = imageData;
  }
  const newLesson = new Lesson(newData);
  const result = await newLesson.save({ session });

  return result;
};

const getAllLessonByModuleIdService = async (moduleId, userId) => {
  const isExistModule = await CourseModule.findById(moduleId);
  if (!isExistModule) {
    throw new ApiError(404, "Module not found");
  }

  const result = await Lesson.aggregate([
    {
      $match: {
        moduleId: isExistModule._id,
      },
    },
    {
      $lookup: {
        from: "viewlessons",
        localField: "_id",
        foreignField: "lessonId",
        as: "viewLesson",
      },
    },
    {
      $project: {
        _id: 1,
        moduleId: 1,
        courseId: 1,
        yt_link: 1,
        git_link: 1,
        title: 1,
        lessonImage: 1,
        description: 1,
        duration: 1,
        createdAt: 1,
        updatedAt: 1,
        viewed: {
          $cond: {
            if: {
              $in: [userId, "$viewLesson.userId"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  return result;
};

const getSingleLessonService = async (lessonId, userId) => {
  const result = await Lesson.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(lessonId),
      },
    },
    {
      $lookup: {
        from: "viewlessons",
        localField: "_id",
        foreignField: "lessonId",
        as: "viewLesson",
      },
    },
    {
      $project: {
        _id: 1,
        moduleId: 1,
        courseId: 1,
        yt_link: 1,
        git_link: 1,
        title: 1,
        lessonImage: 1,
        description: 1,
        duration: 1,
        createdAt: 1,
        updatedAt: 1,
        viewed: {
          $cond: {
            if: {
              $in: [userId, "$viewLesson.userId"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  if (result.length === 0) {
    throw new ApiError(404, "Lesson not found");
  }

  return result[0];
};

const updateLessonService = async (lessonId, payload) => {
  const result = await Lesson.findOneAndUpdate({ _id: lessonId }, payload, {
    new: true,
  });
  return result;
};

const deleteLessonService = async (lessonId) => {
  const result = await Lesson.findByIdAndDelete(lessonId);
  return result;
};

module.exports = {
  createLessonService,
  getAllLessonByModuleIdService,
  getSingleLessonService,
  updateLessonService,
  deleteLessonService,
};
