const Students = require("../models/student");
const Faculties = require("../models/faculties");
const Vendors = require("../models/vendors");
const { redirect } = require("express/lib/response");
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
//// USER LOGIN
let User;
exports.logInPageGET = (req, res) => {
  res.render("index", { title: "Log In" });
};

exports.logInPagePOST = async (req, res, next) => {
  try {
    let msg = true;
    const userType = req.body.userType;
    //// Admin Validation
    if (userType === "admin") {
      if (
        req.body.username === process.env.ADMINUSERNAME &&
        req.body.password === process.env.ADMINPASSWORD
      ) {
        msg = true;
        res.redirect("/admin");
      } else {
        msg = false;
        console.log(process.env.ADMIN_USERNAME, req.body.username);
        res.render("index", { title: "Log In", msg });
      }
    }
    //// Faculty Validation
    else if (userType === "faculty") {
      User = await Faculties.find({
        member_username: { $eq: req.body.username },
        member_password: { $eq: req.body.password },
      });
      if (User.length === 0) {
        msg = false;
        res.render("index", { title: "Log In", msg });
      } else {
        msg = true;
        // res.json(User);
        res.redirect(`/faculty/${User[0]._id}`);
        // res.render("faculty_user", { title: "Faculty User", User });
      }
    }

    //// Student Validation
    else if (userType === "student") {
      User = await Students.find({
        member_username: { $eq: req.body.username },
        member_password: { $eq: req.body.password },
      });
      if (User.length === 0) {
        msg = false;
        res.render("index", { title: "Log In", msg });
      } else {
        msg = true;
        res.redirect(`/student/${User[0]._id}`);
        // res.render("student_user", { title: "Student User", User });
      }
    }
    //// Vendor Validation
    else if (userType === "vendor") {
      User = await Vendors.find({
        member_username: { $eq: req.body.username },
        member_password: { $eq: req.body.password },
      });
      if (User.length === 0) {
        msg = false;
        res.render("index", { title: "Log In", msg });
      } else {
        msg = true;
        res.render("vendor", { title: "Vendor User", User });
      }
    } else {
      res.send("Invalid user");
    }
  } catch (error) {
    next(error);
  }
};

exports.facultyHomePage = (req, res) => {
  const facultyId = req.params._id;
  res.render("faculty_user", { title: "Faculty Home Page", facultyId });
};

exports.displayAllCourses = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const courseArray = await Faculties.find({ _id: req.params._id });
    res.render("list_courses", {
      title: "All Courses",
      courseArray,
      facultyId,
    });
  } catch (error) {
    next(error);
  }
};

// Adding new course
exports.addCourseGET = (req, res) => {
  const facultyId = req.params._id;
  res.render("add_course", { title: "Add Course", facultyId });
};

exports.addCoursePOST = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const courseArray = await Faculties.find({ _id: facultyId });
    const updateCourses = await Faculties.updateOne(
      { _id: facultyId },
      {
        $push: {
          // updating movements
          member_courses: {
            courseId: req.body.courseName.toLowerCase().split("-")[1],
            courseYear: req.body.courseName.toUpperCase().split("-")[0],
            courseName: req.body.courseName,
            lectureDetails: [],
            enrolledStudents: [],
          },
        },
      }
    );
    res.render("add_course", { title: "Add Course", facultyId });
  } catch (error) {
    next(error);
  }
};

// Delete a course
exports.deleteCourse = async (req, res, next) => {
  try {
    const deletedCourse = await Faculties.updateOne(
      { _id: req.body.facultyId },
      {
        $pull: { member_courses: { courseId: req.body.courseId } },
      }
    );

    res.redirect(`/faculty/${req.body.facultyId}/all-courses`);
  } catch (error) {
    next(error);
  }
};

exports.courseDetails = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const course = await Faculties.findOne(
      { _id: facultyId },
      { member_courses: { $elemMatch: { courseId: req.params.courseName } } }
    );
    const courseDetails = course.member_courses;
    res.render("course_detail", {
      title: "Course Detail",
      courseDetails,
      facultyId,
    });
  } catch (error) {
    next(error);
  }
};

exports.addLectureGET = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const course = await Faculties.findOne(
      { _id: facultyId },
      { member_courses: { $elemMatch: { courseId: req.params.courseName } } }
    );
    const courseDetails = course.member_courses;
    res.render("add_lecture", {
      title: "Add lecture",
      courseDetails,
      facultyId,
    });
  } catch (error) {
    next(error);
  }
};

exports.addLecturePOST = async (req, res, next) => {
  try {
    const date = new Date();

    const addLecture = await Faculties.updateOne(
      {
        "member_courses.courseId": req.params.courseName,
      },
      {
        $push: {
          "member_courses.$.lectureDetails": {
            lectureTime: req.body.lectureTime,
            lectureDay: days[date.getDay()],
            lectureNumber: `Lecture ${req.body.lectureNumber}`,
            lectureDate: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
            attendance: [],
          },
        },
      }
    );
    const facultyId = req.params._id;
    const course = await Faculties.findOne(
      { _id: facultyId },
      { member_courses: { $elemMatch: { courseId: req.params.courseName } } }
    );
    const courseDetails = course.member_courses;
    res.render("add_lecture", {
      title: "Add lecture",
      courseDetails,
      facultyId,
    });
    // res.render("course_detail", {
    //   title: "Course Details",
    //   courseDetails,
    //   facultyId,
    // });
  } catch (error) {
    next(error);
  }
};

exports.deleteLecture = async (req, res, next) => {
  try {
    const deletedLecture = await Faculties.findOneAndUpdate(
      { _id: req.body.facultyId },
      {
        $pull: {
          "member_courses.$[i].lectureDetails": {
            lectureNumber: req.body.lectureNumber,
          },
        },
      },
      {
        arrayFilters: [
          {
            "i.courseId": req.body.courseId,
          },
        ],
      }
    );
    res.redirect(
      `/faculty/${req.body.facultyId}/all-courses/${req.body.courseId}`
    );
  } catch (error) {
    next(error);
  }
};

exports.displayAttendanceGET = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const courseId = req.params.courseName;
    const courseName = req.params.courseName;
    const lectureNumber = req.params.lectureNumber;
    const courseArray = await Faculties.find(
      { _id: facultyId, "member_courses.courseId": req.params.courseName },
      { member_courses: 1, _id: 0 }
    );

    const attendanceArray = [
      ...new Set(
        courseArray[0].member_courses
          .find((e) => e.courseId === req.params.courseName)
          .lectureDetails.find(
            (c) => c.lectureNumber === `Lecture ${req.params.lectureNumber}`
          ).attendance
      ),
    ];

    const courses = await Faculties.find(
      { _id: facultyId, "member_courses.courseId": courseId },
      { member_courses: 1, _id: 0 }
    );
    const enrolledStudents = courses[0].member_courses.find(
      (c) => c.courseId === req.params.courseName
    ).enrolledStudents;

    const student = await Students.find();
    const studentData = enrolledStudents.map((id) =>
      student.find((el) => el.member_id === id)
    );

    res.render("attendance", {
      title: "Attendance",
      facultyId,
      attendanceArray,
      lectureNumber,
      courseName,
      studentData,
    });
  } catch (error) {
    next(error);
  }
};

exports.displayAttendancePOST = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const courseName = req.params.courseName;
    const courseId = req.params.courseName;
    const lectureNumber = req.params.lectureNumber;
    const course = await Faculties.findOneAndUpdate(
      {
        _id: facultyId,
        "member_courses[0].courseId": req.params.courseName,
      },

      {
        $push: {
          "member_courses.$[i].lectureDetails.$[j].attendance":
            req.body.studentId,
        },
      },
      {
        arrayFilters: [
          {
            "i.courseId": courseName,
          },
          { "j.lectureNumber": `Lecture ${lectureNumber}` },
        ],
      }
    );
    const courseArray = await Faculties.find(
      { _id: facultyId, "member_courses.courseId": courseName },
      { member_courses: 1, _id: 0 }
    );

    const attendanceArray = [
      ...new Set(
        courseArray[0].member_courses
          .find((e) => e.courseId === req.params.courseName)
          .lectureDetails.find(
            (c) => c.lectureNumber === `Lecture ${req.params.lectureNumber}`
          ).attendance
      ),
    ];

    // console.log(attendanceArray);
    const courses = await Faculties.find(
      { _id: facultyId, "member_courses.courseId": courseId },
      { member_courses: 1, _id: 0 }
    );
    const enrolledStudents = courses[0].member_courses.find(
      (c) => c.courseId === req.params.courseName
    ).enrolledStudents;

    const student = await Students.find();
    const studentData = enrolledStudents.map((id) =>
      student.find((el) => el.member_id === id)
    );

    // console.log(studentData);
    res.render("attendance", {
      title: "Attendance",
      facultyId,
      attendanceArray,
      lectureNumber,
      courseName,
      studentData,
    });
  } catch (error) {
    next(error);
  }
};

exports.viewClassAttendance = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const option = req.params.option;
    const courseId = req.params.courseName;
    const lectureNumber = req.params.lectureNumber;
    const course = await Faculties.find(
      { _id: facultyId, "member_courses.courseId": courseId },
      { member_courses: 1, _id: 0 }
    );

    const attendanceArray = course[0].member_courses
      .find((c) => c.courseId === req.params.courseName)
      .lectureDetails.find(
        (l) => l.lectureNumber === `Lecture ${req.params.lectureNumber}`
      ).attendance;

    const enrolledStudents = course[0].member_courses.find(
      (c) => c.courseId === req.params.courseName
    ).enrolledStudents;

    const student = await Students.find();
    const studentData = enrolledStudents.map((id) =>
      student.find((el) => el.member_id === id)
    );

    // res.json(presentStudents);
    res.render("class_attendance", {
      title: "Class Attendance",
      enrolledStudents,
      attendanceArray,
      facultyId,
      option,
      lectureNumber,
      courseId,
      studentData,
    });
  } catch (error) {
    next(error);
  }
};

// // Mark attendance
exports.allCoursesForMarkAttendance = async (req, res, next) => {
  try {
    const option = req.params.option;
    const facultyId = req.params._id;
    const courseArray = await Faculties.find({ _id: req.params._id });
    res.render("list_courses_ma", {
      title: "All Courses",
      courseArray,
      facultyId,
      option,
    });
  } catch (error) {
    next(error);
  }
};

exports.courseDetailsForMarkAttendance = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const course = await Faculties.findOne(
      { _id: facultyId },
      { member_courses: { $elemMatch: { courseId: req.params.courseName } } }
    );
    const courseDetails = course.member_courses;
    res.render("course_details_ma", {
      title: "Course Detail",
      courseDetails,
      facultyId,
    });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////
exports.addStudentStep1GET = (req, res) => {
  const option = req.params.option;
  const facultyId = req.params._id;
  res.render("add_students_1", {
    title: "Add Student: Step 1",
    facultyId,
    option,
  });
};

exports.addStudentStep1POST = async (req, res, next) => {
  try {
    let msg = true;
    const facultyId = req.params._id;
    const option = req.params.option;
    const faculty = await Faculties.find({ _id: req.params._id });
    const courseExists = faculty[0].member_courses.find(
      (course) => course.courseName === req.body.courseName
    );
    if (courseExists) {
      msg = true;
      res.redirect(
        `/faculty/${
          req.params._id
        }/add-students/${req.body.courseName.toLowerCase()}`
      );
    } else {
      msg = false;
      res.render("add_students_1", {
        title: "Add Student: Step 1",
        facultyId,
        option,
        msg,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.addStudentStep2GET = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const students = await Students.find({
      member_branch: req.params.courseName.split("-")[0].toUpperCase(),
    });
    res.render("add_students_2", {
      title: "Add Students: Step 2",
      students,
      facultyId,
    });
  } catch (error) {
    next(error);
  }
};

exports.addStudentStep2POST = async (req, res, next) => {
  try {
    const enrolledStudents = req.body.enrolledStudents;
    const course = await Faculties.updateOne(
      {
        "member_courses.courseId": req.params.courseName.split("-")[1],
      },
      {
        $set: {
          "member_courses.$.enrolledStudents": enrolledStudents,
        },
      }
    );
    const facultyId = req.params._id;
    const students = await Students.find({
      member_branch: req.params.courseName.split("-")[0].toUpperCase(),
    });
    res.render("add_students_2", {
      title: "Add Students: Step 2",
      students,
      facultyId,
    });
  } catch (error) {
    next(error);
  }
  // res.json(req.body);
};

// Payments
exports.displayPayments = async (req, res, next) => {
  try {
    const facultyId = req.params._id;
    const User = await Faculties.find({
      _id: facultyId,
    });
    const memberBalance = User[0].member_balance;
    const movement = User[0].member_movements;
    const movementDates = User[0].movement_dates;
    const movementId = User[0].movement_id;
    const userType = User[0].member_type;
    res.render("payment", {
      title: "Payment",
      memberBalance,
      movement,
      movementDates,
      movementId,
      userType,
      facultyId,
    });
  } catch (error) {
    next(error);
  }
};

// lectureTime: req.body.lectureTime,
// lectureDay: days[date.getDay()],
// lectureNumber: `Lecture ${req.body.lectureNumber}`,
// lectureDate: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,

///// STUDENT
exports.displayStudentPage = (req, res) => {
  const id = req.params._id;
  res.render("student_user", { title: "Student User", id });
};
exports.displayEnrolledCourses = async (req, res, next) => {
  try {
    const User = await Students.find({ _id: req.params._id });
    const courses = await Faculties.find(
      {
        member_department: User[0].member_department,
        "member_courses.courseYear": User[0].member_branch,
      },
      { member_courses: 1, _id: 0 }
    );

    const coursesArray = courses
      .map((course) => course.member_courses)
      .flat()
      .filter((course) => course.enrolledStudents.includes(User[0].member_id));

    res.render("enrolled_courses", {
      title: "Enrolled Courses",
      coursesArray,
      User,
    });
  } catch (error) {
    next(error);
  }
};

exports.displayStudentPayments = async (req, res, next) => {
  try {
    const User = await Students.find({ _id: req.params._id });
    const memberBalance = User[0].member_balance;
    const movement = User[0].member_movements;
    const movementDates = User[0].movement_dates;
    const movementId = User[0].movement_id;
    const userType = User[0].member_type;
    const id = User[0]._id;
    res.render("payment", {
      title: "Payment",
      memberBalance,
      movement,
      movementDates,
      movementId,
      userType,
      id,
    });
  } catch (error) {
    next(error);
  }
};

exports.studentAttendance = async (req, res, next) => {
  try {
    const User = await Students.find({ _id: req.params._id });
    const userId = User[0].member_id;
    const courseId = req.params.courseName;
    const memberCourses = await Faculties.find(
      {
        member_department: User[0].member_department,
        "member_courses.courseYear": User[0].member_branch,
        "member_courses.courseId": courseId,
      },
      { member_courses: 1, _id: 0 }
    );

    const lectureDetails = memberCourses[0].member_courses.find(
      (course) => course.courseId === courseId
    ).lectureDetails;

    res.render("student_attendance", {
      title: "Attendance",
      lectureDetails,
      User,
      userId,
    });
  } catch (error) {
    next(error);
  }
};

exports.displayLibraryDetails = async (req, res, next) => {
  try {
    const User = await Students.find({ _id: req.params._id });
    const studentId = User[0].member_id;
    const issuedBooks = User[0].issued_books;
    const prevFineAmount = User[0].fine_amount;
    // checking for fine
    let fineAmount = 0;
    issuedBooks.forEach((book) => {
      const returnDate = book.return_date;
      const currDate = Date.now();
      const dueFine = Math.round(
        (currDate - returnDate) / (1000 * 60 * 60 * 24)
      );
      if (dueFine > 0) {
        fineAmount += dueFine * 5;
      }
    });

    if (fineAmount != 0) {
      const updateFineAmount = await Students.updateOne(
        { _id: req.params._id },
        {
          $set: {
            fine_amount: Number(fineAmount),
          },
        }
      );
    }

    // console.log(issuedBooks);
    res.render("student_library_details", {
      title: "Library Details",
      User,
      studentId,
      issuedBooks,
      fineAmount,
    });
  } catch (error) {
    next(error);
  }
};

// CHANGE PIN
exports.facultyChangePinGET = (req, res, next) => {
  try {
    const facultyId = req.params._id;
    res.render("faculty_change_pin", { title: "Change PIN", facultyId });
  } catch (error) {
    next(error);
  }
};

exports.facultyChangePinPOST = async (req, res, next) => {
  try {
    let msg = true;
    const id = req.params._id;
    const User = await Faculties.find({ _id: req.params._id });
    const userType = "faculty";

    if (User[0].member_pin === Number(req.body.member_pin)) {
      const changePin = await Faculties.updateOne(
        { _id: req.params._id },
        {
          $set: {
            member_pin: Number(req.body.new_member_pin),
          },
        }
      );
      msg = true;
      res.render("change_pin_result", {
        title: "Change PIN",
        id,
        msg,
        userType,
      });
    } else {
      msg = false;
      res.render("change_pin_result", {
        title: "Change PIN",
        id,
        msg,
        userType,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.studentChangePinGET = (req, res, next) => {
  try {
    const id = req.params._id;
    res.render("student_pin_change", { title: "Change PIN", id });
  } catch (error) {
    next(error);
  }
};

exports.studentChangePinPOST = async (req, res, next) => {
  try {
    let msg = true;
    const id = req.params._id;
    const User = await Students.find({ _id: req.params._id });
    const userType = "student";

    if (User[0].member_pin === Number(req.body.member_pin)) {
      const changePin = await Students.updateOne(
        { _id: req.params._id },
        {
          $set: {
            member_pin: Number(req.body.new_member_pin),
          },
        }
      );
      msg = true;
      res.render("change_pin_result", {
        title: "Change PIN",
        id,
        msg,
        userType,
      });
    } else {
      msg = false;
      res.render("change_pin_result", {
        title: "Change PIN",
        id,
        msg,
        userType,
      });
    }
  } catch (error) {
    next(error);
  }
};
