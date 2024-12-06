// backend/controllers/noticeController.js
require("dotenv").config();
const nodemailer = require("nodemailer");
const Notice = require("../models/Notice");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// Create Notice
const createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    // Ensure the admin can only create notices for their department
    if (!title) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required!" });
    }

    if (!content && (!req.files || !req.files.image)) {
      return res.status(400).json({
        success: false,
        message: "Either content or an image is required!",
      });
    }
    
    let imagePath = null;

    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadDir = path.join(__dirname, "../uploads/notification");

      // Check if the notification directory exists, if not, create it
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, image.name);

      await image.mv(uploadPath);
      imagePath = `/uploads/notification/${image.name}`;
    }

    const noticeData = {
      title,
      department: user.department,
      postedBy: userId,
      noticeType: "department",
    };

    // console.log(noticeData);

    if (content) noticeData.content = content;
    if (imagePath) noticeData.image = imagePath;

    const notice = await Notice.create(noticeData);

    // Fetch students in the department associated with the admin
    const students = await User.find({
      department: user.department,
      role: "student",
    }).select("email");

    // Filter out invalid or testing emails
    const validEmails = students
      .filter((student) => isValidEmail(student.email))
      .map((student) => student.email);

    if (validEmails.length > 0) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const emailPromises = validEmails.map((email) => {
        const mailOptions = {
          from: `"${user.department} Admin" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "New Notice in Your Department",
          text: `Dear Student, a new notice titled "${title}" has been posted in your department. Please check the notice board for details.`,
        };

        return transporter.sendMail(mailOptions);
      });

      // Wait for all emails to be sent
      Promise.all(emailPromises)
        .then((results) => {
          results.forEach((info, index) => {
            console.log(
              `Email sent successfully to ${validEmails[index]}:`,
              info.response
            );
          });
        })
        .catch((error) => {
          console.error("Error sending some emails:", error);
        });
    }

    return res.status(200).json({
      success: true,
      notice,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to validate emails
const isValidEmail = (email) => {
  // Regex for basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Basic check for common test emails; you can expand this list as needed
  const blacklist = ["test@domain.com", "fake@domain.com"];

  return emailRegex.test(email) && !blacklist.includes(email.toLowerCase());
};

// Get Notice by department
const getNoticesByDepartment = async (req, res, next) => {
  try {
    const { department } = req.query;
    const userId = req.user.id;

    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.status(401).json({ message: "User not found" });
    }

    // If user is a student, restrict to their own department
    if (userFound.department !== department) {
      return res
        .status(403)
        .json({ message: "Access denied to this department's notices" });
    }

    // Find notices by department and include the image field
    const notices = await Notice.find({
      department,
      noticeType: "department",
    }).populate({
      path: "postedBy",
      select: "fullname -_id",
    });

    // If images are stored as file paths, ensure the full URL is returned
    const fullNotices = notices.map((notice) => ({
      ...notice._doc,
      image: notice.image ? `${process.env.BASE_URL}${notice.image}` : null,
    }));

    return res.status(200).json({ notices: fullNotices });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get notice by id
const getNoticeById = async (req, res) => {
  try {
    const user = req.user;
    const noticeId = req.params.id; // Retrieve the notice ID from the query parameters

    console.log(noticeId);

    if (!noticeId) {
      return res.status(400).json({ message: "Notice ID is required" });
    }

    // Fetch the notice by ID and populate the 'postedBy' field with the 'name' field of the user
    const notice = await Notice.findById(noticeId).populate("postedBy", "name");

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Add permission check to ensure user belongs to the same department as the notice
    if (user.department !== notice.department) {
      return res.status(403).json({
        message: "Access forbidden: You do not belong to the same department",
      });
    }

    console.log(notice);

    res.status(200).json(notice);
  } catch (error) {
    console.error("Error fetching notice by ID:", error); // Improved error logging for better debugging
    return res.status(500).json({ message: "Server error" });
  }
};

// update notice
const updateNotice = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    // Find the user and check if they are an admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    // Find the notice to be updated
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found!" });
    }

    // Check if the user is the one who posted the notice and is in the same department
    if (
      userId.toString() !== notice.postedBy.toString() ||
      user.department !== notice.department
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    let imagePath = notice.image; // Default to existing image path

    // Check if a new image file is uploaded
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join(__dirname, "../uploads/", image.name);

      // Delete the old image if it exists and is not the default image
      if (imagePath) {
        const oldImagePath = path.join(__dirname, "..", imagePath);
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Failed to delete old image:", unlinkErr);
              }
            });
          }
        });
      }

      // Move the uploaded file to the desired location
      await image.mv(uploadPath);

      // Set the new image path
      imagePath = `/uploads/${image.name}`;
    }

    // Update the notice with the new details
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, content, image: imagePath },
      { new: true }
    );

    if (!updatedNotice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found!" });
    }

    res.status(200).json({ success: true, notice: updatedNotice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete notice
const deleteNotice = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ status: "fail", message: "Access denied!" });
    }

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res
        .status(404)
        .json({ status: "fail", message: "Notice not found" });
    }

    if (
      userId.toString() !== notice.postedBy.toString() ||
      user.department !== notice.department
    ) {
      return res
        .status(403)
        .json({ status: "fail", message: "Access denied!" });
    }

    // Check if notice has an associated image and delete it
    if (notice.image) {
      const imagePath = path.join(__dirname, "..", notice.image);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
      }
    }

    console.log("image deleted successfully");
    await Notice.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ status: "success", message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const allStudents = async (req, res) => {
  try {
    // Ensure the user is extracted from req (e.g., req.user if you're using JWT middleware)
    const user = req.user; // Assuming user is added to req in middleware
    const { role, department } = user;
    const {status} = req.query;
    console.log(status);

    // console.log(user);
    // Find all users who are students
    const students = await User.find({ role: "student", department,  status: "Approved"});

    // console.log(students);

    // Send response with all student data
    res.status(200).json({ status: "success", students });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const createSemesterNotice = async (req, res, next) => {
  try {
    const { title, content, semester } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    // Ensure the teacher can only create notices for their department
    if (!title || !semester) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required!" });
    }

    // Check if at least one of content or image is provided
    if (!content && (!req.files || !req.files.image)) {
      return res.status(403).json({
        success: false,
        message: "Either provide description or image!",
      });
    }


    let imagePath = null;

    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadDir = path.join(__dirname, "../uploads/semesterNotification");

      // Check if the notification directory exists, if not, create it
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, image.name);

      await image.mv(uploadPath);
      imagePath = `/uploads/semesterNotification/${image.name}`;
    }

    const noticeData = {
      title,
      department: user.department,
      semester,
      postedBy: userId,
      noticeType: "semester",
    };

    if (content) noticeData.content = content;
    if (imagePath) noticeData.image = imagePath;

    console.log(noticeData);

    const notice = await Notice.create(noticeData);

    // Fetch students in the department associated with the teacher
    const students = await User.find({
      department: user.department,
      role: "student",
      semester: semester,
    }).select("email");

    // Filter out invalid or testing emails
    const validEmails = students
      .filter((student) => isValidEmail(student.email))
      .map((student) => student.email);

    if (validEmails.length > 0) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const emailPromises = validEmails.map((email) => {
        const mailOptions = {
          from: `"${user.department} Teacher" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `New Notice in Semester ${semester}`, // Fixed typo: students.semester -> targetSemester
          text: `Dear Student, a new notice titled "${title}" has been posted in your department. Please check the notice board for details.`,
        };

        return transporter.sendMail(mailOptions);
      });

      // Wait for all emails to be sent
      Promise.all(emailPromises)
        .then((results) => {
          results.forEach((info, index) => {
            console.log(
              `Email sent successfully to ${validEmails[index]}:`,
              info.response
            );
          });
        })
        .catch((error) => {
          console.error("Error sending some emails:", error);
        });
    }

    res.status(201).json({
      success: true,
      message: "Notice created successfully and emails sent",
      notice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSemesterNotice = async (req, res, next) => {
  try {
    // const { semester } = req.query;
    const userId = req.user.id; // Get the user ID from the authenticated request

    // Find the user by their ID
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if the student's department and semester match the requested department and semester
    // if (userFound.semester !== semester) {
    //   return res.status(403).json({
    //     message: `Access denied. This notice is for ${semester} semester students only.`,
    //   });
    // }

    // Find notices by the specified semester and include the image field
    // const notices = await Notice.find({
    //   semester: userFound.semester,
    //   department: userFound.department,
    //   noticeType: "semester",
    // }).populate({
    //   path: "postedBy",
    //   select: "fullname -_id",
    // });

    let filterCriteria = {
      department: userFound.department,
      noticeType: "semester",
    };

    // Apply semester filtering only if the user is a student
    if (userFound.role === "student") {
      filterCriteria.semester = userFound.semester;
    }

    // Find notices based on the user's role and department
    const notices = await Notice.find(filterCriteria).populate({
      path: "postedBy",
      select: "fullname -_id",
    });

    console.log(notices);

    // If images are stored as file paths, ensure the full URL is returned
    const fullNotices = notices.map((notice) => ({
      ...notice._doc,
      image: notice.image ? `${process.env.BASE_URL}${notice.image}` : null,
    }));

    console.log(fullNotices);

    return res.status(200).json({ notices: fullNotices });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get semester notice by id
const getSemesterNoticeById = async (req, res) => {
  try {
    const user = req.user;
    const noticeId = req.params.id; // Retrieve the notice ID from the query parameters

    if (!noticeId) {
      return res.status(400).json({ message: "Notice ID is required" });
    }

    // Fetch the notice by ID and populate the 'postedBy' field with the 'name' field of the user
    const notice = await Notice.findById(noticeId).populate("postedBy", "name");

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Add permission check to ensure user belongs to the same department as the notice
    if (user.department !== notice.department) {
      return res.status(403).json({
        message: "Access forbidden: You do not belong to the same department",
      });
    }

    res.status(200).json(notice);
  } catch (error) {
    console.error("Error fetching notice by ID:", error); // Improved error logging for better debugging
    return res.status(500).json({ message: "Server error" });
  }
};

// update semester notice
const updateSemesterNotice = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    // Find the user and check if they are an admin
    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    // Find the notice to be updated
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found!" });
    }

    // Check if the user is the one who posted the notice and is in the same department
    if (
      userId.toString() !== notice.postedBy.toString() ||
      user.department !== notice.department
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    let imagePath = notice.image; // Default to existing image path

    // Check if a new image file is uploaded
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join(
        __dirname,
        "../uploads/semesterNotification",
        image.name
      );

      // Delete the old image if it exists and is not the default image
      if (imagePath) {
        const oldImagePath = path.join(__dirname, "..", imagePath);
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Failed to delete old image:", unlinkErr);
              }
            });
          }
        });
      }

      // Move the uploaded file to the desired location
      await image.mv(uploadPath);

      // Set the new image path
      imagePath = `/uploads/semesterNotification/${image.name}`;
    }

    console.log(imagePath);

    // Update the notice with the new details
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, content, image: imagePath },
      { new: true }
    );

    if (!updatedNotice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found!" });
    }

    res.status(200).json({ success: true, notice: updatedNotice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete semester notice
const deleteSemesterNotice = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user to see if it is the admin
    const user = await User.findById(userId);

    if (!user || user.role != "teacher") {
      return res
        .status(403)
        .json({ status: "fail", message: "Access denied!" });
    }

    // Find the notice to check if it exists and if it was posted by the user
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res
        .status(404)
        .json({ status: "fail", message: "Notice not found" });
    }

    if (
      userId.toString() !== notice.postedBy.toString() ||
      user.department !== notice.department
    ) {
      return res
        .status(403)
        .json({ status: "fail", message: "Access denied!" });
    }

    if (notice.image) {
      const imagePath = path.join(__dirname, "..", notice.image);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
      }
    }

    console.log("image deleted successfully");

    await Notice.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ status: "success", message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// create student notice
const studentNotice = async (req, res) => {
  const { title, content, semester } = req.body;
  const targetStudentId = req.query.studentId; // Extract student ID from query

  try {
    const userId = req.user.id;

    // Validate admin role
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }

    // Validate required fields
    if (!title || !semester) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (!content && (!req.files || !req.files.image)) {
      return res.status(400).json({
        success: false,
        message: "Either content or an image is required.",
      });
    }

    // Check if the student ID is missing
    if (!targetStudentId) {
      return res
        .status(400)
        .json({ success: false, message: "Student ID is required." });
    }

    // Validate student existence in the same department
    const targetStudent = await User.findOne({
      _id: targetStudentId,
      department: user.department,
      role: "student",
    });
    if (!targetStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found in department." });
    }

    // Handle file upload
    let imagePath = null;
    if (req.files && req.files.image) {
      const image = req.files.image;

      // Validate file type
      if (!image.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Invalid file type. Please upload an image.",
        });
      }

      const uploadDir = path.join(__dirname, "../uploads/studentNotification");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, image.name);
      await image.mv(uploadPath);
      imagePath = `/uploads/studentNotification/${image.name}`;
    }

    // Create the notice
    const noticeData = {
      title,
      studentId: targetStudent._id,
      department: user.department,
      semester,
      postedBy: userId,
      noticeType: "student",
      content: content || null,
      image: imagePath || null,
    };

    const notice = await Notice.create(noticeData);

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${user.department} Admin" <${process.env.EMAIL_USER}>`,
      to: targetStudent.email,
      subject: `New Notice for Semester ${semester}`,
      text: `Dear ${targetStudent.fullname}, a new notice titled "${title}" has been posted. Please check the notice board for details.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Notice created successfully and email sent.",
      notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// get student notice
const getStudentNotice = async (req, res) => {
  const studentId = req.user.id; // Assuming `id` is stored in the JWT payload for the logged-in user

  try {
    const notices = await Notice.find({
      noticeType: "student",
      studentId: studentId,
    })
      .populate({ path: "postedBy" })
      .sort({ createdAt: -1 });

    if (!notices.length) {
      return res.status(404).json({
        success: false,
        message: "No notices found for this student.",
      });
    }

    const fullNotices = notices.map((notice) => ({
      ...notice._doc,
      image: notice.image ? `${process.env.BASE_URL}${notice.image}` : null,
    }));

    console.log(fullNotices);

    return res.status(200).json({ success: true, fullNotices });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching notices." });
  }
};

// get student notice
const getAllStudentNotice = async (req, res) => {
  try {
    const notices = await Notice.find({
      noticeType: "student",
      department: req.user.department,
    })
      .populate({ path: "postedBy studentId" })
      .sort({ createdAt: -1 });

    if (!notices.length) {
      return res.status(404).json({
        success: false,
        message: "No notices found for this student.",
      });
    }

    const fullNotices = notices.map((notice) => ({
      ...notice._doc,
      image: notice.image ? `${process.env.BASE_URL}${notice.image}` : null,
    }));

    return res.status(200).json({ success: true, fullNotices });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching notices." });
  }
};

// Get student notice by id
const getStudentNoticeById = async (req, res) => {
  try {
    const user = req.user;
    const noticeId = req.params.id; // Retrieve the notice ID from the query parameters

    console.log(noticeId);

    if (!noticeId) {
      return res.status(400).json({ message: "Notice ID is required" });
    }

    // Fetch the notice by ID and populate the 'postedBy' field with the 'name' field of the user
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Add permission check to ensure user belongs to the same department as the notice
    if (user.department !== notice.department) {
      return res.status(403).json({
        message: "Access forbidden: You do not belong to the same department",
      });
    }

    return res.status(200).json(notice);
  } catch (error) {
    console.error("Error fetching notice by ID:", error); // Improved error logging for better debugging
    return res.status(500).json({ message: "Server error" });
  }
};

// update student notice
const updateStudentNotice = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    // Find the user and check if they are an admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    // Find the notice to be updated
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found!" });
    }

    // Check if the user is the one who posted the notice and is in the same department
    if (
      userId.toString() !== notice.postedBy.toString() ||
      user.department !== notice.department
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    let imagePath = notice.image; // Default to existing image path

    // Check if a new image file is uploaded
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join(
        __dirname,
        "../uploads/studentNotification",
        image.name
      );

      // Delete the old image if it exists and is not the default image
      if (imagePath) {
        const oldImagePath = path.join(__dirname, "..", imagePath);
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Failed to delete old image:", unlinkErr);
              }
            });
          }
        });
      }

      // Move the uploaded file to the desired location
      await image.mv(uploadPath);

      // Set the new image path
      imagePath = `/uploads/studentNotification/${image.name}`;
    }

    console.log(imagePath);

    // Update the notice with the new details
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, content, image: imagePath },
      { new: true }
    );

    if (!updatedNotice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found!" });
    }

    return res.status(200).json({ success: true, notice: updatedNotice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete semester notice
const deleteStudentNotice = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(userId);
    // Find the user to see if it is the admin
    const user = await User.findById(userId);

    if (!user || user.role != "admin") {
      return res
        .status(403)
        .json({ status: "fail", message: "Access denied!" });
    }

    // Find the notice to check if it exists and if it was posted by the user
    const notice = await Notice.findById(req.params.id);

    console.log(notice);

    if (!notice) {
      return res
        .status(404)
        .json({ status: "fail", message: "Notice not found" });
    }

    if (
      userId.toString() !== notice.postedBy.toString() ||
      user.department !== notice.department
    ) {
      return res
        .status(403)
        .json({ status: "fail", message: "Access denied!" });
    }

    if (notice.image) {
      const imagePath = path.join(__dirname, "..", notice.image);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
      }
    }

    console.log("image deleted successfully");

    await Notice.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ status: "success", message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// create principal notice
const principalNotice = async (req, res) => {
  const { title, content } = req.body;

  try {
    const userId = req.user.id;

    // Validate admin role
    const user = await User.findById(userId);
    if (!user || user.role !== "principal") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Principal only." });
    }

    // Validate required fields
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (!content && (!req.files || !req.files.image)) {
      return res.status(400).json({
        success: false,
        message: "Either content or an image is required.",
      });
    }

    // Handle file upload
    let imagePath = null;
    if (req.files && req.files.image) {
      const image = req.files.image;

      // Validate file type
      if (!image.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Invalid file type. Please upload an image.",
        });
      }

      const uploadDir = path.join(__dirname, "../uploads/principal");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, image.name);
      await image.mv(uploadPath);
      imagePath = `/uploads/principal/${image.name}`;
    }

    // Create the notice
    const noticeData = {
      title,
      postedBy: userId,
      noticeType: "principal",
      content: content || null,
      image: imagePath || null,
    };

    const notice = await Notice.create(noticeData);

    res.status(201).json({
      success: true,
      message: "Notice created successfully.",
      notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// get principal notice
const getPrincipalNotice = async (req, res) => {
  try {
    // Find notices by the specified semester and include the image field
    const notices = await Notice.find({
      noticeType: "principal",
    }).populate({
      path: "postedBy",
      select: "fullname -_id",
    });

    console.log(notices);

    // If images are stored as file paths, ensure the full URL is returned
    const fullNotices = notices.map((notice) => ({
      ...notice._doc,
      image: notice.image ? `${process.env.BASE_URL}${notice.image}` : null,
    }));

    console.log(fullNotices);

    return res.status(200).json({ notices: fullNotices });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get principal notice by id
const getPrincipalNoticeById = async (req, res) => {
  try {
    const user = req.user;
    const noticeId = req.params.id; // Retrieve the notice ID from the query parameters

    if (!noticeId) {
      return res.status(400).json({ message: "Notice ID is required" });
    }

    // Fetch the notice by ID and populate the 'postedBy' field with the 'name' field of the user
    const notice = await Notice.findById(noticeId).populate({
      path: "postedBy",
      select: "fullname _id",
    });

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Add permission check to ensure user belongs to the same department as the notice
    if (user.role !== notice.postedBy) {
      return res.status(403).json({
        message: "Access forbidden: You cannot access this notice",
      });
    }

    res.status(200).json(notice);
  } catch (error) {
    console.error("Error fetching notice by ID:", error); // Improved error logging for better debugging
    return res.status(500).json({ message: "Server error" });
  }
};

// update principal notice
const updatePrincipalNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    // Find the user and check if they are an admin
    const user = await User.findById(userId);
    if (!user || user.role !== "principal") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    // Find the notice to be updated
    const notice = await Notice.findById(req.params.id).populate({
      path: "postedBy",
      select: "fullname _id",
    });

    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found!" });
    }

    // Check if the user is the one who posted the notice and is in the same department
    if (userId.toString() !== notice.postedBy._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    let imagePath = notice.image; // Default to existing image path

    // Check if a new image file is uploaded
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join(
        __dirname,
        "../uploads/principal",
        image.name
      );

      // Delete the old image if it exists and is not the default image
      if (imagePath) {
        const oldImagePath = path.join(__dirname, "..", imagePath);
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Failed to delete old image:", unlinkErr);
              }
            });
          }
        });
      }

      // Move the uploaded file to the desired location
      await image.mv(uploadPath);

      // Set the new image path
      imagePath = `/uploads/principal/${image.name}`;
    }

    console.log(imagePath);

    // Update the notice with the new details
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, content, image: imagePath },
      { new: true }
    );

    if (!updatedNotice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found!" });
    }

    res.status(200).json({ success: true, notice: updatedNotice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete principal notice
const deletePrincipalNotice = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user to see if it is the admin
    const user = await User.findById(userId);

    if (!user || user.role !== "principal") {
      return res
        .status(403)
        .json({ status: "fail", message: "Access denied!" });
    }

    // Find the notice to check if it exists and if it was posted by the user
    const notice = await Notice.findById(req.params.id).populate({
      path: "postedBy",
      select: "_id",
    });

    if (!notice) {
      return res
        .status(404)
        .json({ status: "fail", message: "Notice not found" });
    }

    if (userId.toString() !== notice.postedBy._id.toString()) {
      return res
        .status(403)
        .json({ status: "fail", message: "Access denied!" });
    }

    if (notice.image) {
      const imagePath = path.join(__dirname, "..", notice.image);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
      }
    }

    console.log("image deleted successfully");

    await Notice.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ status: "success", message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

module.exports = {
  createNotice,
  getNoticesByDepartment,
  getNoticeById,
  updateNotice,
  deleteNotice,
  allStudents,
  createSemesterNotice,
  getSemesterNotice,
  updateSemesterNotice,
  deleteSemesterNotice,
  getStudentNotice,
  getSemesterNoticeById,
  studentNotice,
  getAllStudentNotice,
  deleteStudentNotice,
  updateStudentNotice,
  getStudentNoticeById,
  principalNotice,
  getPrincipalNotice,
  getPrincipalNoticeById,
  updatePrincipalNotice,
  deletePrincipalNotice,
};
