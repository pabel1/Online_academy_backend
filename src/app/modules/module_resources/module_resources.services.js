const ApiError = require("../../../errors/apiError");
const CourseModule = require("../course_module/course_module.model");
const ModuleResources = require("./module_resources.model");

const createResourcesService = async (payload, imageData, session) => {
  const requiredFields = ["moduleId", "courseId", "content"];

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
    newData.resourceImage = imageData;
  }
  const newLesson = new ModuleResources(newData);
  const result = await newLesson.save({ session });

  return result;
};

const getAllResourcesService = async (moduleId) => {
  const result = await ModuleResources.find({ moduleId: moduleId });

  return result;
};

const updateModuleResourceService = async (resourceId, payload) => {
  const result = await ModuleResources.findOneAndUpdate(
    { _id: resourceId },
    payload,
    { new: true }
  );
  return result;
};

const deleteModuleResourceService = async (moduleId) => {
  const result = await ModuleResources.findByIdAndDelete(moduleId);
  return result;
};

module.exports = {
  createResourcesService,
  getAllResourcesService,
  updateModuleResourceService,
  deleteModuleResourceService,
};
