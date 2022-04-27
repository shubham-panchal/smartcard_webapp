var express = require("express");
var router = express.Router();

// require Controllers
const logInController = require("../controllers/loginController");
const userController = require("../controllers/userController");
const vendorController = require("../controllers/vendorController");
const libraryController = require("../controllers/libraryController");

/* GET home page. */
router.get("/", userController.logInPageGET);
router.post("/", userController.logInPagePOST);

// reroute to login page
router.get("/admin/logout", function (req, res) {
  res.render("", { title: "Log In" });
});
// router.get("/faculty/logout", function (req, res) {
//   res.render("", { title: "Log In" });
// });

// ADMIN ROUTES
router.get("/admin", logInController.adminPage);
router.get("/admin/add-member", logInController.addMemberGET);
router.post("/admin/add-member", logInController.addMemberPOST);

router.get("/admin/students", logInController.listAllStudents);
router.get("/admin/faculties", logInController.listAllFaculties);
router.get("/admin/vendors", logInController.listAllVendors);

// Recharge Wallet ROUTES
router.get("/admin/recharge-wallet", logInController.rechargeWalletGET);
router.post("/admin/recharge-wallet", logInController.rechargeWalletPOST);

// FACULTY ROUTES
router.get("/faculty/:_id", userController.facultyHomePage);
router.get("/faculty/:_id/all-courses", userController.displayAllCourses);

// delete course route
router.post("/faculty/:_id/delete-course", userController.deleteCourse);

router.get("/faculty/:_id/add-course", userController.addCourseGET);
router.post(
  "/faculty/:_id/add-course",
  userController.addCoursePOST,
  userController.displayAllCourses
);

router.get(
  "/faculty/:_id/all-courses/:courseName",
  userController.courseDetails
);
router.get(
  "/faculty/:_id/all-courses/:courseName/add-lecture",
  userController.addLectureGET
);
router.post(
  "/faculty/:_id/all-courses/:courseName/add-lecture",
  userController.addLecturePOST
);
router.post(
  `/faculty/:_id/all-courses/:courseName/delete-lecture`,
  userController.deleteLecture
);

router.get(
  "/faculty/:_id/all-courses/:courseName/:lectureNumber",
  userController.displayAttendanceGET
);
router.post(
  "/faculty/:_id/all-courses/:courseName/:lectureNumber",
  userController.displayAttendancePOST
);

// mark-attendance routes
router.get(
  "/faculty/:_id/view-attendance",
  userController.allCoursesForMarkAttendance
);

router.get(
  "/faculty/:_id/view-attendance/:courseName",
  userController.courseDetailsForMarkAttendance
);

router.get(
  "/faculty/:_id/view-attendance/:courseName/:lectureNumber",
  userController.viewClassAttendance
);

router.get("/faculty/:_id/add-students", userController.addStudentStep1GET);
router.post("/faculty/:_id/add-students", userController.addStudentStep1POST);
router.get(
  "/faculty/:_id/add-students/:courseName",
  userController.addStudentStep2GET
);
router.post(
  "/faculty/:_id/add-students/:courseName",
  userController.addStudentStep2POST
);

// FAULTY-PAYMENT ROUTES
router.get("/faculty/:_id/payments", userController.displayPayments);

// STUDENT ROUTES
router.get("/student/:_id", userController.displayStudentPage);
router.get("/student/:_id/all-courses", userController.displayEnrolledCourses);
router.get(
  "/student/:_id/all-courses/:courseName",
  userController.studentAttendance
);

router.get(
  "/student/:_id/library-details",
  userController.displayLibraryDetails
);

// STUDENT-PAYMENT ROUTES
router.get("/student/:_id/payments", userController.displayStudentPayments);

// FACULTY CHANGE PIN
router.get("/faculty/:_id/change-pin", userController.facultyChangePinGET);
router.post("/faculty/:_id/change-pin", userController.facultyChangePinPOST);
// STUDENT CHANGE PIN
router.get("/student/:_id/change-pin", userController.studentChangePinGET);
router.post("/student/:_id/change-pin", userController.studentChangePinPOST);

// VENDOR ROUTES
router.get("/vendor/add-foodItem", vendorController.addItemGET);
router.post("/vendor/add-foodItem", vendorController.addItemPOST);
router.get("/vendor/order", vendorController.collectOrderGET);
router.post("/vendor/order", vendorController.collectOrderPOST);
router.get("/vendor/order/place-order", vendorController.placeOrderGET);
router.post("/vendor/order/place-order", vendorController.placeOrderPOST);
router.get("/vendor/new-order", vendorController.newOrder);

//// LIBRARY ROUTES
router.get("/library", libraryController.displayHomePage);
router.get("/library/admin", libraryController.libraryAdminLoginGET);
router.post("/library/admin", libraryController.libraryAdminLoginPOST);
router.get("/library-admin", libraryController.libraryAdminPage);
router.get("/library-admin/add-books", libraryController.addBooksGET);
router.post("/library-admin/add-books", libraryController.addBooksPOST);
router.get("/library/:action", libraryController.getUserId);
router.post("/library/:action", libraryController.postUserId);
router.get("/library/fine-payment/:id", libraryController.finePaymentGET);
router.post("/library/fine-payment/:id", libraryController.finePaymentPOST);
router.get("/library/:action/:id", libraryController.displayFormGET);
router.post("/library/:action/:id", libraryController.displayFormPOST);

//// LIBRARY ADMIN ROUTES

module.exports = router;
