const ApiError = require("../../../errors/apiError");
const ViewLesson = require("./view_lesson.model");

const createLessonViewService = async (payload, userId) => {
  const requiredFields = ["lessonId"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  payload.userId = userId;

  const isAlreadyView = await ViewLesson.findOne({
    lessonId: payload.lessonId,
    userId: payload.userId,
  });

  let result;

  if (!isAlreadyView) {
    result = await ViewLesson.create(payload);
  }

  return result;
};

module.exports = {
  createLessonViewService,
};
