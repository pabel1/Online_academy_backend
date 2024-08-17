const express = require("express");
const auth = require("../../middlewares/auth");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");
const ResourcesController = require("./module_resources.controller");
const UploadLocallyWithFolder = require("../../middlewares/UploadLocallyWithFolder");

const router = express.Router();

router.post(
  "/",
  auth("Super Admin", "Admin"),
  UploadLocallyWithFolder.single("resourceImage"),
  // UploadImageCloudinary.single("resourceImage"),
  ResourcesController.createResources
);

router.get("/:moduleId", auth(), ResourcesController.getAllResources);
router.patch("/:resourceId", auth(), ResourcesController.updateModuleResource);
router.delete("/:resourceId", auth(), ResourcesController.deleteModuleResource);

module.exports = router;
