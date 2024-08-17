const { default: mongoose } = require("mongoose");
const ApiError = require("../../../errors/apiError");
const { paginationHelpers } = require("../../../helpers/paginationHelpers");
const { courseSearchableFields } = require("./course.constant");
const Course = require("./course.model");
const User = require("../User/user.model");
const Enroll = require("../enroll/enroll.model");
const CourseModule = require("../course_module/course_module.model");

const createCourseService = async (payload, imageData, session) => {
  const requiredFields = ["courseName", "category"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  // const lastCourseCode = await Course.find({});
  const lastCourseCode = await Course.findOne(
    {},
    { courseCode: 1, _id: 0 },
    { sort: { _id: -1 }, limit: 1 }
  );
  // console.log(lastCourseCode);

  // const newCourseCode = `COURSE-${lastCourseCode.length + 1}`;
  const newCourseCode = `COURSE-${
    parseInt(lastCourseCode.courseCode.split("-")[1]) + 1
  }`;
  console.log(newCourseCode);

  payload.courseCode = newCourseCode;

  // const isExistCourse = await Course.findOne({
  //   courseName: payload.courseName,
  // });

  // if (isExistCourse) {
  //   throw new ApiError(400, "Course already exist");
  // }

  if (!imageData.url) {
    throw new ApiError(400, "Please provide course image");
  }

  const newData = {
    ...payload,
    courseImage: imageData,
  };
  const newCourse = new Course(newData);
  const result = await newCourse.save({ session });

  return result;
};

const getAllCourseService = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const aggregationPipeline = [];
  const matchStage = {};

  if (searchTerm) {
    const searchConditions = courseSearchableFields.map((field) => ({
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

  aggregationPipeline.push({
    $lookup: {
      from: "lessons",
      localField: "_id",
      foreignField: "courseId",
      as: "lessons",
    },
  });

  aggregationPipeline.push({
    $lookup: {
      from: "coursemodules",
      localField: "_id",
      foreignField: "courseId",
      as: "modules",
    },
  });

  aggregationPipeline.push({
    $project: {
      _id: 1,
      category: 1,
      courseCode: 1,
      courseImage: 1,
      courseName: 1,
      description: 1,
      totalReview: 1,
      totalLessons: { $size: "$lessons" },
      totalModules: { $size: "$modules" },
    },
  });

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

  const result = await Course.aggregate(aggregationPipeline);
  const total = await Course.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllEnrolledCourseUsersService = async (
  filters,
  paginationOptions,
  query
) => {
  const { searchTerm, ...filtersData } = filters;

  console.log("filters data: ", filtersData);

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const aggregationPipeline = [];
  const matchStage = {};

  if (searchTerm) {
    const searchConditions = enrollSearchableFields.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));

    matchStage.$or = searchConditions;
  }

  // const filterCondition = Object.entries(filtersData).map(([key, value]) => ({
  //   [key]: value,
  // }));

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

  // console.log("courseName: ", filtersData.courseName);

  // Pagination Stage
  aggregationPipeline.push({ $skip: skip });
  aggregationPipeline.push({ $limit: limit });
  aggregationPipeline.push(
    {
      $lookup: {
        from: "enrolls",
        localField: "_id",
        foreignField: "courseId",
        as: "enroll",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
        ],
      },
    }
    // {
    //   $lookup: {
    //     from: "users",
    //     localField: "userId",
    //     foreignField: "_id",
    //     as: "user",
    //   },
    // },
    // {
    //   $project: {
    //     _id: 1,
    //     courseId: 1,
    //     userId: 1,
    //     enrolledDate: 1,
    //     status: 1,
    //     course: {
    //       $arrayElemAt: ["$course", 0],
    //     },
    //     user: {
    //       $arrayElemAt: ["$user", 0],
    //     },
    //   },
    // }
  );

  const result = await Course.aggregate(aggregationPipeline);
  const total = await Course.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCourseService = async (courseId) => {
  const result = await Course.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(courseId),
      },
    },
  ]);

  return result[0];
};

const getUniqueCategories = async () => {
  // const uniqueCategories = await Course.aggregate([
  //   {
  //     $group: {
  //       _id: "$category",
  //     },
  //   },
  // ]);
  const uniqueCategories = await Course.distinct("category");

  return {
    uniqueCategories,
  };
};

const getTotalAllForDbService = async () => {
  const totalUsers = await User.countDocuments();
  const totalEnrolledUser = await Enroll.countDocuments();
  const totalCourse = await Course.countDocuments();
  const totalModule = await CourseModule.countDocuments();

  return {
    totalUsers,
    totalEnrolledUser,
    totalCourse,
    totalModule,
  };
};

const deleteCourseService = async (courseId) => {
  const result = await Course.findByIdAndDelete(courseId);
  return result;
};

module.exports = {
  createCourseService,
  getAllCourseService,
  getSingleCourseService,
  getTotalAllForDbService,
  getUniqueCategories,
  getAllEnrolledCourseUsersService,
  deleteCourseService,
};
