const { default: mongoose } = require("mongoose");
const ApiError = require("../../../errors/apiError");
const Enroll = require("./enroll.model");
const Course = require("../course/course.model");
const User = require("../User/user.model");
const { paginationHelpers } = require("../../../helpers/paginationHelpers");
const { enrollSearchableFields } = require("./enroll.constant");
const unorm = require("unorm");

const createEnrollService = async (payload, userId) => {
  const { phone, fullName } = payload;

  if (!payload.courseId) {
    throw new ApiError(400, "Course is required");
  }

  const isExistCourse = await Course.findById(payload.courseId);
  if (!isExistCourse) {
    throw new ApiError(400, "Course not found");
  }

  const isAlreadyEnrolled = await Enroll.findOne({
    courseId: payload.courseId,
    userId: userId,
  });

  if (isAlreadyEnrolled) {
    throw new ApiError(400, "You already enrolled this course");
  }

  const newData = {
    courseId: payload.courseId,
    userId: userId,
    enrolledDate: new Date(),
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (phone || fullName) {
      const userData = {};
      if (phone) {
        userData.phone = phone;
      }
      if (fullName) {
        userData.fullName = fullName;
      }

      await User.findOneAndUpdate(
        { _id: userId },
        { $set: userData },
        { session }
      );
    }

    const result = await Enroll.create([newData], { session });

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new ApiError(500, error.message);
  }
};

const getAllEnrollUserBySingleCourseService = async (courseId) => {
  const isExistCourse = await Course.findById(courseId);

  if (!isExistCourse) {
    throw new ApiError(400, "Course not found");
  }

  const result = await Enroll.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        _id: 0,
        courseId: 1,
        userId: 1,
        enrolledDate: 1,
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        courseId: 1,
        userId: 1,
        enrolledDate: 1,
        user: {
          _id: 1,
          fullName: 1,
          email: 1,
          role: 1,
          profileImage: 1,
          phone: 1,
        },
      },
    },
  ]);

  return result;
};

const isEnrolled = async(courseId, userId) =>{
  const isEnrolledCourse = await Enroll.findOne({
    courseId,
    userId
  })

  return isEnrolled;
}

const getMyEnrollCourseService = async (userId) => {
  const result = await Enroll.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course",
      },
    },
    // --new
    {
      $unwind: "$course",
    },
    // --old
    // {
    //   $project: {
    //     _id: 0,
    //     courseId: 1,
    //     userId: 1,
    //     enrolledDate: 1,
    //     course: {
    //       $arrayElemAt: ["$course", 0],
    //     },
    //   },
    // },

    // --new
    {
      $project: {
        _id: 0,
        courseId: 1,
        userId: 1,
        enrolledDate: 1,
        status: 1,
        course: {
          _id: "$course._id",
          courseName: "$course.courseName",
          courseCode: {
            $cond: {
              if: { $eq: ["$status", "pending"] },
              then: "$$REMOVE",
              else: "$course.courseCode",
            },
          },
          category: "$course.category",
          courseImage: "$course.courseImage",
          description: {
            $cond: {
              if: { $eq: ["$status", "pending"] },
              then: "$$REMOVE",
              else: "$course.description",
            },
          },
          startDate: "$course.startDate",
          endDate: "$course.endDate",
          totalReview: {
            $cond: {
              if: { $eq: ["$status", "pending"] },
              then: "$$REMOVE",
              else: "$course.totalReview",
            },
          },
        },
      },
    },
  ]);

  return result;
};

const getAllEnrollDetailsService = async (filters, paginationOptions) => {
  // console.log("pagination service :", paginationOptions);
  // const result = await Enroll.aggregate([
  //   {
  //     $lookup: {
  //       from: "courses",
  //       localField: "courseId",
  //       foreignField: "_id",
  //       as: "course",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "userId",
  //       foreignField: "_id",
  //       as: "user",
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       courseId: 1,
  //       userId: 1,
  //       enrolledDate: 1,
  //       course: {
  //         $arrayElemAt: ["$course", 0],
  //       },
  //       user: {
  //         $arrayElemAt: ["$user", 0],
  //       },
  //     },
  //   },
  // ]);

  // return result;

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

  // if (Object.keys(filtersData).length) {
  //   matchStage.$and = Object.entries(filtersData).map(([field, value]) => ({
  //     [field]: value,
  //   }));
  // }
  const filterCondition = Object.entries(filtersData).map(([key, value]) => ({
    [key]: value,
  }));

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
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course",
        // pipeline: [
        //   {$match: { category: "firebase"}}
        // ],
        pipeline: [
          ...(filterCondition.length > 0
            ? [{ $match: { $and: filterCondition } }]
            : []),
        ],
      },
    },
    {
      $match: {
        "course.courseName": { $exists: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $project: {
        _id: 1,
        courseId: 1,
        userId: 1,
        enrolledDate: 1,
        status: 1,
        course: {
          $arrayElemAt: ["$course", 0],
        },
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    }
  );

  const result = await Enroll.aggregate(aggregationPipeline);
  const total = await Enroll.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleEnrollDetailsService = async (enrollId) => {
  const result = await Enroll.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(enrollId),
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        _id: 0,
        courseId: 1,
        userId: 1,
        enrolledDate: 1,
        course: {
          $arrayElemAt: ["$course", 0],
        },
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
  ]);

  return result;
};

const updateStatusService = async (enrollId, payload) => {
  // const update = { status: "approved" };
  const result = await Enroll.findOneAndUpdate({ _id: enrollId }, payload, {
    new: true,
  });

  return result;
};

module.exports = {
  createEnrollService,
  getAllEnrollUserBySingleCourseService,
  getMyEnrollCourseService,
  getAllEnrollDetailsService,
  getSingleEnrollDetailsService,
  updateStatusService,
  isEnrolled
};
