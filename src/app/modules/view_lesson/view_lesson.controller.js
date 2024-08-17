const sendResponse = require("../../../shared/sendResponse");
const ViewLessonService = require("./view_lesson.service");

const createLessonView = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await ViewLessonService.createLessonViewService(
      req.body,
      userId
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Lesson view successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLessonView,
};
