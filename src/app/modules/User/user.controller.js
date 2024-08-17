const paginationFields = require("../../../constants/pagination");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const { userFilterableFields } = require("./user.constant");
const UserService = require("./user.services");

const createUser = async (req, res, next) => {
  try {
    const file = req.file;

    let imageData = {};

    if (file?.path) {
      imageData = {
        url: file?.path,
        public_id: file?.filename,
      };
    }

    const result = await UserService.createUserService(req.body, imageData);

    const { password, ...userData } = result._doc;

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const filters = pick(req.query, userFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result = await UserService.getAllUsersService(
      filters,
      paginationOptions
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Users",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await UserService.getMyProfileService(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My Profile",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const result = await UserService.getSingleUserService(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Single User",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getMyProfile,
  getSingleUser,
};
