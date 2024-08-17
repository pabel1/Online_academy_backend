const httpStatus = require("http-status");
const sendResponse = require("../../../shared/sendResponse");
const fs = require("fs");
const imageServices = require("./imageProvider.service");

const imageProviderWithFolder = async (req, res) => {
  let image;
  try {
    image = await imageServices.imageCreateInToDB(req);
  } catch (error) {}

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "image  created successfully",
    data: {
      image,
    },
  });
};

const getImageUsingFolderName = async (req, res) => {
  let result;
  console.log("first");
  try {
    result = await imageServices.getImageUsingFolderNameFromDB(req, res);
    // console.log(result);
    // const stream = fs.createReadStream(result);
    // stream.pipe(res);
  } catch (error) {
    console.log(error);
  }

  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: "image  get successfully",
  //   data: {
  //     result,
  //   },
  // });
};

const imgProviderController = {
  imageProviderWithFolder,
  getImageUsingFolderName,
};
module.exports = imgProviderController;
