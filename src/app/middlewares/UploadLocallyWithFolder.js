const multer = require("multer");
const path = require("path");

const CreateUploadsFile = require("../../utils/createUploadFile");
const generateSlug = require("../../shared/generateSlug");

// ----------------------------------------------------
//File Upload directory
const imageUploadDirectory = "./uploads/images";
const fileUploadDirectory = "./uploads/files";

// ----------------------------------------------------
// File Upload storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(req);
    if (file?.fieldname === "image" || "courseImage") {
      //   const userFolder = req.body.folder || "default";
      const userFolder = req.params.folder || "default";
      const destination = path.join(imageUploadDirectory, userFolder);
      //   const destination = path.join(imageUploadDirectory);
      CreateUploadsFile(destination);
      cb(null, destination);
    }
    if (file?.fieldname === "files") {
      const userFolder = req.body.folder || "default";
      const destination = path.join(fileUploadDirectory, userFolder);
      CreateUploadsFile(destination);
      cb(null, destination);
    }
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file?.originalname);
    console.log(fileExtension);
    const fileName = generateSlug(file?.originalname);
    // console.log(fileName);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (file?.fieldname === "image") {
      if (!file?.originalname?.match(/\.(jpg|jpeg|png|webp)$/)) {
        return cb(new Error("Please upload an image"));
      }
    }
    cb(null, true);
  },
});

const UploadLocallyWithFolder = upload;

module.exports = UploadLocallyWithFolder;
