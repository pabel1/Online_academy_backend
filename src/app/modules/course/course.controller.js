const paginationFields = require("../../../constants/pagination");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const imageServices = require("../imageProvider/imageProvider.service");
const { default: mongoose } = require("mongoose");
const {
  courseFilterableFields,
  courseEnrollFilterableFields,
} = require("./course.constant");
const CourseService = require("./course.service");
// const { enrollFilterableFields } = require("./enroll.constant");

const createCourse = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // console.log(req);
    const image = await imageServices.imageCreateInToDB(req, session);

    console.log("image :", image);
    let imageData = {};

    if (image) {
      imageData = {
        url: image.link,
        public_id: image.path,
      };
    }

    console.log(req.body);
    const result = await CourseService.createCourseService(
      req.body,
      imageData,
      session
    );
    await session.commitTransaction();
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Course created successfully",
      data: result,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    // End the session
    session.endSession();
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    const filters = pick(req.query, courseFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result = await CourseService.getAllCourseService(
      filters,
      paginationOptions
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get All Courses",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllEnrollCourseUserDetails = async (req, res, next) => {
  try {
    const filters = pick(req.query, courseEnrollFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    // console.log("paginationOptions: ", paginationOptions);
    const result = await CourseService.getAllEnrolledCourseUsersService(
      filters,
      paginationOptions,
      req.query
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get all enroll details.",
      // meta: result.meta,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const result = await CourseService.getSingleCourseService(courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get Single course.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUniqueCategories = async (req, res, next) => {
  try {
    const result = await CourseService.getUniqueCategories();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "get all unique categories.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getTotalAllForDb = async (req, res, next) => {
  try {
    const result = await CourseService.getTotalAllForDbService();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get Total All For Db.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const result = await CourseService.deleteCourseService(courseId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Course deleted successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  getTotalAllForDb,
  getUniqueCategories,
  getAllEnrollCourseUserDetails,
  deleteCourse,
};
