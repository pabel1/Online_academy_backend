const express = require("express");
const auth = require("../../middlewares/auth");
const EnrollController = require("./enroll.controller");

const router = express.Router();

router.post("/", auth(), EnrollController.createEnrollCourse);

router.get(
  "/course/:courseId",
  auth(),
  EnrollController.getAllEnrollUserBySingleCourse
);
router.get(
  "/get-my-enrolled-courses",
  auth(),
  EnrollController.getMyEnrollCourse
);
router.get("/", auth(), EnrollController.getAllEnrollDetails);
router.get("/:enrollId", auth(), EnrollController.getSingleEnrollDetails);
router.get("/isEnrolled/:courseId/:userId", auth(), EnrollController.isEnrolled);
router.patch("/:enrollId", auth(), EnrollController.updateStatus)

module.exports = router;
