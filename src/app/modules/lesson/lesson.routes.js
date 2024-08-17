const express = require("express");
const auth = require("../../middlewares/auth");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");
const LessonController = require("./lesson.controller");
const UploadLocallyWithFolder = require("../../middlewares/UploadLocallyWithFolder");

const router = express.Router();

router.patch("/:lessonId", auth(), LessonController.updateLesson);
router.post(
  "/",
  auth("Super Admin", "Admin"),
  UploadLocallyWithFolder.single("lessonImage"),
  // UploadImageCloudinary.single("lessonImage"),
  LessonController.createLesson
);

router.get(
  "/module/:moduleId",
  auth(),
  LessonController.getAllLessonByModuleId
);
router.get("/:lessonId", auth(), LessonController.getSingleLesson);
router.delete("/:lessonId", auth(), LessonController.deleteLesson);

module.exports = router;
