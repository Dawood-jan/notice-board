// backend/models/Notice.js
const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  department: {
    type: String,
    required: function () {
      return this.noticeType !== "principal";
    },
  },
  image: { type: String },
  noticeType: {
    type: String,
    enum: ["department", "semester", "student", "principal"],
    required: true,
  },
  semester: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
    // required: function () {
    //   return this.noticeType === "semester" || this.noticeType === "student";
    // },
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.noticeType === "student";
    },
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notice", NoticeSchema);
