// backend/models/Notice.js
const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, },
  department: { type: String, required: true }, 
  image:{type: String},
  noticeType: { type: String, enum: ["department", "semester"], required: true },
  semester: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
    required: function () {
      return this.noticeType === "semester";
    },
  },
  postedBy: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notice", NoticeSchema);
