const express = require("express");
const UserController = require("./user.controller");
const auth = require("../../middlewares/auth");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");

const router = express.Router();

router.post(
  "/",
  UploadImageCloudinary.single("profileImage"),
  UserController.createUser
);

router.get("/", UserController.getAllUsers);

router.get("/my-profile", auth(), UserController.getMyProfile);

router.get("/:userId", UserController.getSingleUser);

module.exports = router;
