const { default: mongoose } = require("mongoose");
const ApiError = require("../../../errors/apiError");
const CourseModule = require("../course_module/course_module.model");
const Quiz = require("./quiz.model");
const QuizMark = require("../quiz_mark/quiz_mark.model");

const createQuizService = async (payload) => {
  const requiredFields = [
    "moduleId",
    "courseId",
    "question",
    "options",
    "answer",
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

  const result = await Quiz.create(payload);

  return result;
};

const getAllQuizService = async (moduleId) => {
  const result = await Quiz.aggregate([
    {
      $match: {
        moduleId: new mongoose.Types.ObjectId(moduleId),
      },
    },
    {
      $project: {
        moduleId: 1,
        courseId: 1,
        question: 1,
        options: 1,
      },
    },
  ]);

  return result;
};

const answerListService = async (payload, userId) => {
  const requiredFields = ["moduleId", "courseId", "answerList"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistModule = await CourseModule.findById(payload.moduleId);
  if (!isExistModule) {
    throw new ApiError(404, "Module not found");
  }

  let mark = 0;

  for (const answer of payload.answerList) {
    const rightAnswer = await Quiz.findOne({
      _id: answer.questionId,
      answer: answer.answer,
    });

    if (rightAnswer) {
      mark = mark + 1;
    }
  }

  const result = await QuizMark.create({
    moduleId: payload.moduleId,
    courseId: payload.courseId,
    userId: userId,
    score: mark,
  });

  return result;
};

const getMyModuleQuizMarkService = async (moduleId, userId) => {
  const result = await QuizMark.findOne({
    moduleId: moduleId,
    userId: userId,
  });

  return result;
};

const getSingleQuizService = async (quizId) => {
  const result = await Quiz.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(quizId),
      },
    },
    {
      $project: {
        _id: 1,
        courseId: 1,
        moduleId: 1,
        question: 1,
        options: 1,
        answer: 1,
      },
    },
  ]);

  return result;
};

const updateQuizService = async (quizId, payload) => {
  const result = await Quiz.findOneAndUpdate(
    { _id: quizId },
    payload,
    { new: true }
  );
  return result;
};

const deleteQuizService = async (quizId) => {
  const result = await Quiz.findByIdAndDelete(quizId);
  return result;
};

module.exports = {
  createQuizService,
  getAllQuizService,
  answerListService,
  getMyModuleQuizMarkService,
  updateQuizService,
  deleteQuizService,
  getSingleQuizService
};
