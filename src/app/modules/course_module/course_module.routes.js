const express = require("express");
const auth = require("../../middlewares/auth");
const CourseModuleController = require("./course_module.controller");

const router = express.Router();

router.post("/", auth(), CourseModuleController.createCourseModule);

router.get(
  "/course/:courseId",
  // auth(),
  CourseModuleController.getAllCourseModuleByCourseId
);

router.get("/:moduleId", auth(), CourseModuleController.getSingleCourseModule);
router.patch("/:moduleId", auth(), CourseModuleController.updateCourseModule);
router.delete("/:moduleId", auth(), CourseModuleController.deleteCourseModule)

module.exports = router;
