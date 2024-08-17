/* eslint-disable node/no-extraneous-require */
const express = require("express");
const UploadLocallyWithFolder = require("../../middlewares/UploadLocallyWithFolder");
const imgProviderController = require("./imageProvider.controller");

const router = express.Router();

router.post(
  "/create-with-folder/:folder",
  UploadLocallyWithFolder.single("image"),
  imgProviderController.imageProviderWithFolder
);

router.get("/get/:folder/:slug", imgProviderController.getImageUsingFolderName);

const imageProviderRouter = router;

module.exports = imageProviderRouter;
