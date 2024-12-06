const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    validate: [
      {
        validator: function (value) {
          // Allow only letters (both uppercase and lowercase) and spaces
          return /^[A-Za-z\s]+$/.test(value);
        },
        message: "Name can only contain letters.",
      },
      {
        validator: function (value) {
          // Ensure the name has a maximum length of 25 characters
          return value.length <= 25;
        },
        message: "Name must not exceed 25 characters.",
      },
    ],
  },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: {
    type: String,
    enum: ["student", "admin", "teacher", "principal"],
    required: true,
  },
  department: {
    type: String,
    required: function () {
      return this.role !== "principal";
    },
  },
  semester: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8"], // Enum values as strings
    required: function () {
      return this.role === "student"; // Semester is required only for students
    },
    default: "1"
  },

  file: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("User", UserSchema);
