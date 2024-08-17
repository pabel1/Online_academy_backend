const express = require("express");
const auth = require("../../middlewares/auth");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");
const CourseController = require("./course.controller");
const UploadLocallyWithFolder = require("../../middlewares/UploadLocallyWithFolder");

const router = express.Router();

router.get("/total-all-for-db", CourseController.getTotalAllForDb);

router.post(
  "/",
  auth("Super Admin", "Admin"),
  // UploadImageCloudinary.single("courseImage"),
  UploadLocallyWithFolder.single("courseImage"),
  CourseController.createCourse
);

router.get(
  "/enrolledCourseUsers",
  CourseController.getAllEnrollCourseUserDetails
);
router.get("/categories", CourseController.getUniqueCategories);
router.get("/", CourseController.getAllCourses);

router.get("/:courseId", CourseController.getSingleCourse);
router.delete("/:courseId", auth(), CourseController.deleteCourse);

module.exports = router;
