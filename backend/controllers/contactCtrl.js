const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const contactCtrl = async (req, res, next) => {
  try {
    const { fullname, email, subject, message } = req.body;

    // Check if all required fields are provided
    if (!email || !fullname || !subject || !message) {
      return res.status(422).json({ message: "All fields are required!" });
    }

    const userEmail = email.toLowerCase();

    // Check if the email is a Gmail address
    if (!userEmail.endsWith("@gmail.com")) {
      return res
        .status(422)
        .json({ message: "Only @gmail.com emails are allowed" });
    }

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Organization's email address
        pass: process.env.EMAIL_PASSWORD, // Organization's email password
      },
    });

    // Email to send to the organization
    const mailOptions = {
      from: `${fullname} <${userEmail}>`, // User's email
      to: process.env.EMAIL_USER, // Organization's email
      subject: subject,
      text: message,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({success: "true", message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Login error:", error); // Log the actual error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  contactCtrl,
};
