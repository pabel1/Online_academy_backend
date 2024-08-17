const mongoose = require("mongoose");
const imgProviderSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    link: {
      type: String,
    },
    destination: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ImgProviderModel = mongoose.model("img_provider", imgProviderSchema);

module.exports = ImgProviderModel;
