const sendResponse = require("../../../shared/sendResponse");
const imageServices = require("../imageProvider/imageProvider.service");
const LessonService = require("./lesson.service");
const { default: mongoose } = require("mongoose");
const createLesson = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // console.log(req);
    const image = await imageServices.imageCreateInToDB(req, session);

    console.log("image :", image);
    let imageData = {};

    if (image) {
      imageData = {
        url: image.link,
        public_id: image.path,
      };
    }

    const result = await LessonService.createLessonService(
      req.body,
      imageData,
      session
    );
    await session.commitTransaction();
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Lesson created successfully",
      data: result,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    // End the session
    session.endSession();
  }
};

const getAllLessonByModuleId = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user._id;

    const result = await LessonService.getAllLessonByModuleIdService(
      moduleId,
      userId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lesson fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user._id;

    const result = await LessonService.getSingleLessonService(lessonId, userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lesson fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    const payload = req.body;
    const result = await LessonService.updateLessonService(lessonId, payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lesson updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    const result = await LessonService.deleteLessonService(lessonId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lesson deleted successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLesson,
  getAllLessonByModuleId,
  getSingleLesson,
  updateLesson,
  deleteLesson,
};
