const sendResponse = require("../../../shared/sendResponse");
const QuizService = require("./quiz.service");

const createQuiz = async (req, res, next) => {
  try {
    const result = await QuizService.createQuizService(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Quiz created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllQuiz = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    const result = await QuizService.getAllQuizService(moduleId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Quiz fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const answerListController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await QuizService.answerListService(req.body, userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Quiz fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getSingleQuiz = async (req, res, next) => {
  try {
    const result = await QuizService.getSingleQuizService(req.params.quizId);
// console.log(req.params.quizId)
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get single quiz successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyModuleQuizMark = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { moduleId } = req.params;

    const result = await QuizService.getMyModuleQuizMarkService(
      moduleId,
      userId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Quiz mark fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const payload = req.body;
    const result = await QuizService.updateQuizService(quizId, payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Quiz updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const result = await QuizService.deleteQuizService(quizId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Quiz deleted successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuiz,
  getAllQuiz,
  answerListController,
  getMyModuleQuizMark,
  updateQuiz,
  deleteQuiz,
  getSingleQuiz
};
