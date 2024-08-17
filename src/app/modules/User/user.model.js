const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const config = require("../../../config/config");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter Your Name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Super Admin", "Admin", "Moderator", "User"],
      default: "User",
    },
    profileImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    phone: {
      type: String,
      length: [11, "Phone number must be 11 digits"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    age: {
      type: Number,
    },
    education: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
