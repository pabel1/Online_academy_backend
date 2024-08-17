const { default: mongoose } = require("mongoose");
const ApiError = require("../../../errors/apiError");
const { paginationHelpers } = require("../../../helpers/paginationHelpers");
const { userSearchableFields } = require("./user.constant");
const User = require("./user.model");

const createUserService = async (payload, imageData) => {
  const requiredFields = ["fullName", "email", "password"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistUser = await User.findOne({ email: payload.email });

  if (isExistUser) {
    throw new ApiError(400, "Email already exist");
  }

  const newData = {
    ...payload,
  };

  if (imageData.url) {
    newData.profileImage = imageData;
  }

  if (payload?.role) {
    newData.role = "User";
  }

  const result = await User.create(newData);

  return result;
};

const getAllUsersService = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const aggregationPipeline = [];
  const matchStage = {};

  if (searchTerm) {
    const searchConditions = userSearchableFields.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));

    matchStage.$or = searchConditions;
  }

  if (Object.keys(filtersData).length) {
    matchStage.$and = Object.entries(filtersData).map(([field, value]) => ({
      [field]: value,
    }));
  }

  if (Object.keys(matchStage).length > 0) {
    aggregationPipeline.push({ $match: matchStage });
  }

  // Sort Stage
  const sortConditions = {};

  // Dynamic sort needs fields to do sorting
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Add Sort Stage to Aggregation Pipeline
  if (Object.keys(sortConditions).length > 0) {
    aggregationPipeline.push({ $sort: sortConditions });
  }

  // Pagination Stage
  aggregationPipeline.push({ $skip: skip });
  aggregationPipeline.push({ $limit: limit });
  aggregationPipeline.push({
    $project: {
      password: 0,
    },
  });

  const result = await User.aggregate(aggregationPipeline);
  const total = await User.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyProfileService = async (userId) => {
  const result = await User.findById(userId);

  if (!result) {
    throw new ApiError(404, "User not found");
  }

  return result;
};

const getSingleUserService = async (userId) => {
  const result = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);

  return result[0];
};

module.exports = {
  createUserService,
  getAllUsersService,
  getMyProfileService,
  getSingleUserService,
};
