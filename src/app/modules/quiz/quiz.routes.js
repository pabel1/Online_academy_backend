const express = require("express");
const auth = require("../../middlewares/auth");
const QuizController = require("./quiz.controller");

const router = express.Router();

router.post("/answer-list", auth(), QuizController.answerListController);
router.get("/mark/:moduleId", auth(), QuizController.getMyModuleQuizMark);

router.post("/", auth("Super Admin", "Admin"), QuizController.createQuiz);
router.get("/:moduleId", auth(), QuizController.getAllQuiz);
router.get("/singleQuiz/:quizId", auth(), QuizController.getSingleQuiz)
router.patch("/:quizId", auth(), QuizController.updateQuiz);
router.delete("/:quizId", auth(), QuizController.deleteQuiz);


module.exports = router;
