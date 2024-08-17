const express = require("express");
const auth = require("../../middlewares/auth");
const ViewLessonController = require("./view_lesson.controller");

const router = express.Router();

router.post("/", auth(), ViewLessonController.createLessonView);

module.exports = router;
