const express = require("express");
const router = express.Router();
const {
  createNotice,
  createSemesterNotice,
  getNoticesByDepartment,
  getNoticeById,
  updateNotice,
  deleteNotice,
  allStudents,
  getSemesterNotice,
  updateSemesterNotice,
  deleteSemesterNotice
} = require("../controllers/noticeCtrl");
const authMiddleware = require("../middleware/authMiddleware");

// Create a notice
router.post("/create-notice", authMiddleware, createNotice);

router.post("/create-semester-notice", authMiddleware, createSemesterNotice);


router.get("/semester-notice", authMiddleware, getSemesterNotice);

// Get all notices by department
router.get("/department", authMiddleware, getNoticesByDepartment);

router.get("/all-students", authMiddleware, allStudents);

//  Get notice by id
router.get("/:id", authMiddleware, getNoticeById);

// Update the notice
router.put("/update-notice/:id", authMiddleware, updateNotice);

// Delete the notice
router.delete("/delete-notice/:id", authMiddleware, deleteNotice);


// Update the semester notice
router.put("/update-semester-notice/:id", authMiddleware, updateSemesterNotice);

// Delete the semester notice
router.delete("/delete-semester-notice/:id", authMiddleware, deleteSemesterNotice);

module.exports = router;
