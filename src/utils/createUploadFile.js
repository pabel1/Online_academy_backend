const fs = require("fs");

const CreateUploadsFile = (directory) => {
  console.log(directory);
  // directory.forEach((dir) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  // });
};

module.exports = CreateUploadsFile;
