const ApiError = require("../../../errors/apiError");
const generateUploadImageLink = require("../../../helpers/generateUploadImageLink");
const ImgProviderModel = require("./imageProvider.model");
const fs = require("fs");
const path = require("path");
const imageCreateInToDB = async (req, session) => {
  const images = req.file;
  // console.log(images);

  let image;
  //  check this image already created or not
  const isExist = await ImgProviderModel.findOne({
    slug: images?.filename,
    destination: images?.destination,
    path: images?.path,
  });

  if (!isExist) {
    const imageData = generateUploadImageLink(req, images);
    // console.log("imageData :", imageData);
    const data = {
      link: imageData?.url,
      slug: images?.filename,
      filename: images?.originalname,
      destination: images?.destination,
      path: images?.path,
    };
    const newImage = new ImgProviderModel(data);
    image = await newImage.save({ session });
  } else {
    image = isExist;
  }

  return image;
};

const getImageUsingFolderNameFromDB = async (req, res) => {
  try {
    const { slug, folder } = req.params;

    console.log(slug);
    console.log(folder);
    const result = await ImgProviderModel.findOne({ slug: slug });
    console.log(result);
    const imagePath = path.join(
      __dirname,
      "../../../../uploads",
      "images",
      `${folder}`,
      `${slug}`
    );
    console.log(imagePath);
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        // Return 404 if file does not exist
        res.status(404).send("Image not found");
        return;
      }
      const stream = fs.createReadStream(imagePath);
      stream.pipe(res);
    });
  } catch (error) {
    throw new ApiError(400, `${error}`);
  }
};
const imageServices = {
  imageCreateInToDB,
  getImageUsingFolderNameFromDB,
};
module.exports = imageServices;
