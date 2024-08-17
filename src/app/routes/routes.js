const express = require("express");
const AuthRoutes = require("../modules/auth/auth.routes");
const UserRoutes = require("../modules/User/user.routes");
const CourseRoutes = require("../modules/course/course.routes");
const EnrollRoutes = require("../modules/enroll/enroll.routes");
const CourseModuleRoutes = require("../modules/course_module/course_module.routes");
const LessonRoutes = require("../modules/lesson/lesson.routes");
const ModuleResourcesRoutes = require("../modules/module_resources/module_resources.routes");
const QuizRoutes = require("../modules/quiz/quiz.routes");
const ViewLessonRoutes = require("../modules/view_lesson/view_lesson.routes");
const imageProviderRouter = require("../modules/imageProvider/imageProvider.route");

const router = express.Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/course",
    route: CourseRoutes,
  },
  {
    path: "/enroll",
    route: EnrollRoutes,
  },
  {
    path: "/course-module",
    route: CourseModuleRoutes,
  },
  {
    path: "/lesson",
    route: LessonRoutes,
  },
  {
    path: "/module-resources",
    route: ModuleResourcesRoutes,
  },
  {
    path: "/quiz",
    route: QuizRoutes,
  },
  {
    path: "/view-lesson",
    route: ViewLessonRoutes,
  },
  {
    path: "/images",
    route: imageProviderRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
