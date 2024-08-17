const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((el) => {
    return {
      path: el?.path,
      message: el?.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: errors[0]?.message || error?.message || "Something went wrong !",
    errorMessages: errors,
  };
};

module.exports = handleValidationError;
