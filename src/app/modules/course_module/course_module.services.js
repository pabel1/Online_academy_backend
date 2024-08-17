const { default: mongoose } = require("mongoose");
const ApiError = require("../../../errors/apiError");
const CourseModule = require("./course_module.model");

const createCourseModuleService = async (payload) => {
  const requiredFields = ["courseId", "moduleNumber", "title", "description"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const newData = {
    courseId: payload.courseId,
    moduleNumber: payload.moduleNumber,
    title: payload.title,
    description: payload.description,
  };

  const isExistModule = await CourseModule.findOne({
    courseId: payload.courseId,
    moduleNumber: payload.moduleNumber,
  });

  if (isExistModule) {
    throw new ApiError(400, "Module Number already exist");
  }

  const result = await CourseModule.create(newData);

  return result;
};

const getAllCourseModuleByCourseIdService = async (courseId) => {
  const result = await CourseModule.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $project: {
        _id: 1,
        courseId: 1,
        moduleNumber: 1,
        title: 1,
        description: 1,
      },
    },
  ]);

  return result;
};

const getSingleCourseModuleService = async (moduleId) => {
  const result = await CourseModule.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(moduleId),
      },
    },
    {
      $project: {
        _id: 1,
        courseId: 1,
        moduleNumber: 1,
        title: 1,
        description: 1,
      },
    },
  ]);

  return result;
};

const updateCourseModuleService = async (moduleId, payload) => {
  const result = await CourseModule.findOneAndUpdate(
    { _id: moduleId },
    payload,
    { new: true }
  );

  return result;
};

const deleteCourseModuleService = async (moduleId) => {
  const result = await CourseModule.findByIdAndDelete(moduleId);
  return result;
};

module.exports = {
  createCourseModuleService,
  getAllCourseModuleByCourseIdService,
  getSingleCourseModuleService,
  updateCourseModuleService,
  deleteCourseModuleService,
};
