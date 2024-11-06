const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ["student", "admin", "teacher"], required: true },
  department: { type: String, required: true },
  semester: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8"], // Enum values as strings
    required: true,
  },
  file: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
