const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // confirmPassword: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ["student", "admin"], required: true },
  department: { type: String, required: true },
  file: { type: String },
  // noticed: [
  //   { type: mongoose.Schema.Types.ObjectId, ref: "Notice" }
  // ],
});

module.exports = mongoose.model("User", UserSchema);
