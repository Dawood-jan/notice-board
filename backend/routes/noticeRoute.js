const express = require("express");
const router = express.Router();
const {
  createNotice,
  createSemesterNotice,
  getNoticesByDepartment,
  studentNotice,
  getNoticeById,
  getStudentNotice,
  updateNotice,
  deleteNotice,
  allStudents,
  getSemesterNotice,
  updateSemesterNotice,
  getSemesterNoticeById,
  deleteSemesterNotice,
  getAllStudentNotice,
  deleteStudentNotice,
  updateStudentNotice,
  getStudentNoticeById
} = require("../controllers/noticeCtrl");
const authMiddleware = require("../middleware/authMiddleware");

// Create a notice
router.post("/create-notice", authMiddleware, createNotice);

router.post("/create-semester-notice", authMiddleware, createSemesterNotice);

router.get("/semester-notice", authMiddleware, getSemesterNotice);

// Get all notices by department
router.get("/department", authMiddleware, getNoticesByDepartment);

// Get all student notices
router.get("/all-student-notice", authMiddleware, getAllStudentNotice);

// Get all student 
router.get("/all-students", authMiddleware, allStudents);

// Get all student 
router.get("/student-notice", authMiddleware, getStudentNotice);

// create student notice
router.post("/student-notice", authMiddleware, studentNotice);

router.get(
  "/student-notice/:id",
  authMiddleware,
  getStudentNoticeById
);

// update student notice
router.put("/student-notice/:id", authMiddleware, updateStudentNotice);

// delete student notice
router.delete("/student-notice/:id", authMiddleware, deleteStudentNotice);

router.get(
  "/update-semester-notice/:id",
  authMiddleware,
  getSemesterNoticeById
);

//  Get notice by id
router.get("/:id", authMiddleware, getNoticeById);

// Update the notice
router.put("/update-notice/:id", authMiddleware, updateNotice);

// Delete the notice
router.delete("/delete-notice/:id", authMiddleware, deleteNotice);

// Update the semester notice
router.put("/update-semester-notice/:id", authMiddleware, updateSemesterNotice);

// Delete the semester notice
router.delete(
  "/delete-semester-notice/:id",
  authMiddleware,
  deleteSemesterNotice
);

module.exports = router;
