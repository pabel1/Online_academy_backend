const paginationFields = require("../../../constants/pagination");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const { enrollFilterableFields } = require("./enroll.constant");
const EnrollService = require("./enroll.service");

const createEnrollCourse = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await EnrollService.createEnrollService(req.body, userId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Course enrolled successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllEnrollUserBySingleCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const result = await EnrollService.getAllEnrollUserBySingleCourseService(
      courseId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get all enroll user by single course.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const isEnrolled = async(req, res, next) =>{
  try{
    const courseId = req.params;
    console.log("courseId: ",courseId)
  }catch(error){
    next(error)
  }
}

const getMyEnrollCourse = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await EnrollService.getMyEnrollCourseService(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get my enroll courses.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllEnrollDetails = async (req, res, next) => {
  try {
    const filters = pick(req.query, enrollFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    // console.log("paginationOptions: ", paginationOptions);
    const result = await EnrollService.getAllEnrollDetailsService(
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

const getSingleEnrollDetails = async (req, res, next) => {
  try {
    const enrollId = req.params.enrollId;

    const result = await EnrollService.getSingleEnrollDetailsService(enrollId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get single enroll details.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async(req, res, next) => {
  try{
    const enrollId = req.params.enrollId;
    const payload = req.body;
    const result = await EnrollService.updateStatusService(enrollId, payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "updated successfully!",
      data: result,
    });
  }catch (error){
    next(error)
  }
}

module.exports = {
  createEnrollCourse,
  getAllEnrollUserBySingleCourse,
  getMyEnrollCourse,
  getAllEnrollDetails,
  getSingleEnrollDetails,
  updateStatus,
  isEnrolled
};
