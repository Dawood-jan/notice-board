const express = require("express");
const router = express.Router();
const {
  createNotice,
  getNoticesByDepartment,
  getNoticeById,
  updateNotice,
  deleteNotice,
  allStudents
} = require("../controllers/noticeCtrl");
const authMiddleware = require("../middleware/authMiddleware");

// Create a notice
router.post("/create-notice", authMiddleware, createNotice);

// Get all notices by department
router.get("/department", authMiddleware, getNoticesByDepartment);


router.get("/all-students", authMiddleware, allStudents);

//  Get notice by id
router.get("/:id", authMiddleware, getNoticeById);

// Update the notice
router.put("/update-notice/:id", authMiddleware, updateNotice);

// Delete the notice
router.delete("/delete-notice/:id", authMiddleware, deleteNotice);




module.exports = router;
