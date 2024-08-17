const sendResponse = require("../../../shared/sendResponse");
const imageServices = require("../imageProvider/imageProvider.service");
const ResourcesService = require("./module_resources.services");
const { default: mongoose } = require("mongoose");
const createResources = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // console.log(req);
    const image = await imageServices.imageCreateInToDB(req, session);

    console.log("image :", image);
    let imageData = {};

    if (image) {
      imageData = {
        url: image.link,
        public_id: image.path,
      };
    }

    const result = await ResourcesService.createResourcesService(
      req.body,
      imageData,
      session
    );
    await session.commitTransaction();
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Resources created successfully",
      data: result,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    // End the session
    session.endSession();
  }
};

const getAllResources = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    const result = await ResourcesService.getAllResourcesService(moduleId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Resources fetched successfully",
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateModuleResource = async (req, res, next) => {
  try {
    const resourceId = req.params.resourceId;
    const payload = req.body;
    const result = await ResourcesService.updateModuleResourceService(
      resourceId,
      payload
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Resource updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteModuleResource = async (req, res, next) => {
  try {
    const resourceId = req.params.resourceId;
    const result = await ResourcesService.deleteModuleResourceService(
      resourceId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Module deleted successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResources,
  getAllResources,
  updateModuleResource,
  deleteModuleResource,
};
