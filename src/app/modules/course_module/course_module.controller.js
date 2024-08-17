const sendResponse = require("../../../shared/sendResponse");
const CourseModuleService = require("./course_module.services");

const createCourseModule = async (req, res, next) => {
  try {
    const result = await CourseModuleService.createCourseModuleService(
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Course module created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCourseModuleByCourseId = async (req, res, next) => {
  try {
    const result =
      await CourseModuleService.getAllCourseModuleByCourseIdService(
        req.params.courseId
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get all course module successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleCourseModule = async (req, res, next) => {
  try {
    const result = await CourseModuleService.getSingleCourseModuleService(
      req.params.moduleId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get single course module successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourseModule = async(req, res, next) =>{
  try{
    const moduleId = req.params.moduleId;
    const payload = req.body;
    const result = await CourseModuleService.updateCourseModuleService(moduleId, payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Module updated successfully!",
      data: result,
    });

  }catch(error){
    next(error)
  }
}

const deleteCourseModule = async(req, res, next) =>{
  try{
    const moduleId = req.params.moduleId;
    const result = await CourseModuleService.deleteCourseModuleService(moduleId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Resources deleted successfully!",
      data: result,
    });

  }catch(error){
    next(error)
  }
}

module.exports = {
  createCourseModule,
  getAllCourseModuleByCourseId,
  getSingleCourseModule,
  updateCourseModule,
  deleteCourseModule
};
