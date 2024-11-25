const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ["student", "admin", "teacher", "principal"], required: true },
  department: { type: String, required: function() {
    return this.role !=="principal";
  } },
  semester: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8"], // Enum values as strings
    required: function () {
      return this.role === "student"; // Semester is required only for students
    },
  },
 
  file: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved"],
    default: "Pending",
  },
});

module.exports = mongoose.model("User", UserSchema);
