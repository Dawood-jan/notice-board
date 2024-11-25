const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("Contact", contactSchema);