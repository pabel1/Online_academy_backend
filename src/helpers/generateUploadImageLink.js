const generateUploadImageLink = (req, image) => {
  const url = req.get("host");
  const folderName = req.params.folder || "default";
  const protocol = req.protocol;
  const imageLink =
    "https" +
    "://" +
    url +
    "/api" +
    "/v1" +
    "/images/" +
    "get/" +
    `${folderName}/` +
    image?.filename;

  let imageData = {};
  if (imageLink) {
    imageData = {
      url: imageLink,
      filename: image?.filename,
    };
  }

  return imageData;
};

module.exports = generateUploadImageLink;
