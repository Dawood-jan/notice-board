const express = require("express");
const router = express.Router();
const {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  profilePhotCtrl,
  getNoticeCtrl,
  updateUserCtrl,
  getProfilePhotCtrl,
  facultyCtrl,
  allFaculty,
  approveUserCtrl,
  rejectUserCtrl,
  GetRejectedUserCtrl,
  getPendingUsers,
  updateStudentRecordCtrl,
  getStudentByIdCtrl
} = require("../controllers/userCtrl");
const authMiddleware = require("../middleware/authMiddleware");



//user/register
router.post("/register", registerCtrl);

//user/login
router.post("/login", loginCtrl);

//user/profile
router.get("/profile", authMiddleware, profileCtrl);

router.post("/faculty", authMiddleware, facultyCtrl);

router.get("/all-faculty", authMiddleware, allFaculty);

//user/profile-photo
router.post("/profile-photo", authMiddleware, profilePhotCtrl);

// user/profile-hoto
router.get("/profile-photo", authMiddleware, getProfilePhotCtrl);

//user/update-user
router.put("/update-user", authMiddleware, updateUserCtrl);

//user/notices
router.get("/notices", authMiddleware, getNoticeCtrl);

router.get("/pending-users", authMiddleware, getPendingUsers);

router.put("/approve-user/:userId", authMiddleware, approveUserCtrl);

router.put("/reject-user/:userId", authMiddleware, rejectUserCtrl);

router.get("/rejected-user", authMiddleware, GetRejectedUserCtrl);


router.get("/get-student/:id", authMiddleware, getStudentByIdCtrl);

router.put("/update-student-record/:id", authMiddleware, updateStudentRecordCtrl);


module.exports = router;
