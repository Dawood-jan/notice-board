const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    validate: [
      {
        validator: function (value) {
          // Allow only letters (both uppercase and lowercase) and spaces
          return /^[A-Za-z\s]+$/.test(value);
        },
      },
      {
        validator: function (value) {
          // Ensure the name has a maximum length of 25 characters
          return value.length <= 25;
        },
      },
    ],
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Contact", contactSchema);
