const courseFilterableFields = [
  "searchTerm",
  "courseName",
  "courseCode",
  "category",
  "totalReview",
];

const courseEnrollFilterableFields = ["courseName"];

const courseSearchableFields = ["courseName", "description", "category"];

module.exports = {
  courseFilterableFields,
  courseSearchableFields,
  courseEnrollFilterableFields,
};
