const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const User = require("../models/User");
const Notice = require("../models/Notice");

//register
const registerCtrl = async (req, res, next) => {
  try {
    const { fullname, email, password, confirmPassword, department, semester, role } =
      req.body;

    if (!fullname || !email || !password || !confirmPassword || !department || !semester || !role) {
      return res.status(422).json({ message: "All fields are required!" });
    }

    const newEmail = email.toLowerCase();

    // Check if the email is a Gmail address
    if (!newEmail.endsWith("@gmail.com")) {
      return res
        .status(422)
        .json({ message: "Only @gmail.com emails are allowed" });
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(422).json({ message: "Email already exists" });
    }

    if (password.trim().length < 6) {
      return res
        .status(422)
        .json({ message: "Password should be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email: newEmail,
      department,
      role,
      semester,
      password: hashPass,
    });

    return res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

//login
const loginCtrl = async (req, res, next) => {
  try {
    const { email, password, department, semester } = req.body; // Added semester here

    // Check if all required fields are provided
    if (!email || !password || !department) {
      return res.status(422).json({ message: "All fields are required!" });
    }

    const userEmail = email.toLowerCase();

    // Check if the email is a Gmail address
    if (!userEmail.endsWith("@gmail.com")) {
      return res
        .status(422)
        .json({ message: "Only @gmail.com emails are allowed" });
    }

    // Find the user by email
    const userFound = await User.findOne({ email: userEmail });

    // Check if the user exists
    if (!userFound) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { role, department: userDepartment, semester: userSemester } = userFound;

    // Check if the department matches
    if (department !== userDepartment) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Debugging: Log semester comparison for teachers and students
    console.log(`Comparing semesters: received=${semester}, expected=${userSemester}`);

    // If the user is a student or teacher, check if the semester matches
    if ((role === "student" || role === "teacher") && semester !== userSemester) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isValidPassword = await bcrypt.compare(password, userFound.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { _id: id, fullname } = userFound;

    const token = jwt.sign(
      { id, fullname, role, department, email: userEmail, semester },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Prepare the response object
    const response = {
      token,
      id,
      fullname,
      department,
      email: userEmail,
    };

    // Include role and semester only for students and teachers
    if (role === "student" || role === "teacher") {
      response.role = role;
      response.semester = userSemester;
    } else if (role === "admin") {
      response.role = role; // Include role for admin
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error); // Log the actual error for debugging
    res.status(500).json({ message: "Server error" });
  }
};


//profile
const profileCtrl = async (req, res, next) => {
  try {
    const userId = req.user.id; // Ensure this is set by authMiddleware

    const userFound = await User.findById(userId).select("-password");

    if (!userFound) {
      return next(appErr("User not found", 404));
    }

    console.log(userFound);

    res.status(200).json(userFound);
  } catch (error) {
    next(appErr(error.message, 500)); // Pass the error to the error handling middleware
  }
};

//upload profile photo
const profilePhotCtrl = async (req, res, next) => {
  try {
    if (!req.files) {
      return next(appErr("Please choose an image", 422));
    }

    // Find the user in the database
    const userFound = await User.findById(req.user.id);

    if (!userFound) {
      return next(appErr("User not found", 404));
    }

    const { avatar } = req.files;

    // Check the size of the picture
    if (avatar.size > 5000000) {
      return next(appErr("Profile picture should not be too big", 422));
    }

    // Determine the user's role and set the appropriate directory
    const roleDirectory = userFound.role === "admin" ? "admin" : "student";
    const uploadDir = path.join(__dirname, "..", "uploads", roleDirectory);

    // Ensure the directory exists; create it if it doesn't
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Delete the old pic if it exists
    if (userFound.avatar) {
      try {
        await fs.promises.unlink(
          path.join(__dirname, "..", "uploads", roleDirectory, userFound.avatar)
        );
      } catch (err) {
        // Log the error but don't stop the execution
        console.error("Error deleting old avatar:", err);
      }
    }

    // Generate a new file name for the avatar
    const fileName = avatar.name;
    const splittedName = fileName.split(".");
    const newFileName =
      splittedName[0] + uuid() + "." + splittedName[splittedName.length - 1];

    console.log(newFileName);

    // Move the new file to the appropriate directory
    avatar.mv(path.join(uploadDir, newFileName), async (err) => {
      if (err) {
        return next(appErr(err));
      }

      // Update the user's avatar in the database
      const updateAvatar = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: newFileName },
        { new: true }
      );

      if (!updateAvatar) {
        return next(appErr("Avatar couldn't be changed", 422));
      }

      const photoUrl = `/uploads/${roleDirectory}/${newFileName}`;

      console.log(photoUrl);

      // Return the URL of the uploaded photo
      res.status(200).json({
        success: true,
        photoUrl,
      });
    });
  } catch (error) {
    return next(appErr(error));
  }
};

const getProfilePhotCtrl = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated user
    const user = await User.findById(userId).select("role avatar"); // Assuming 'photoUrl' is stored in the User model

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure user.avatar exists and is not undefined
    if (!user.avatar) {
      return res
        .status(404)
        .json({ success: false, message: "Profile photo not found" });
    }

    // Safely check user's role before setting the directory
    const roleDirectory = user.role === "admin" ? "admin" : "student";

    // Construct the full URL to the profile photo
    const photoUrl = `uploads/${roleDirectory}/${user.avatar}`;

    res.json({ success: true, photoUrl });
  } catch (error) {
    console.error("Error fetching profile photo:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// update user
const updateUserCtrl = async (req, res, next) => {
  try {
    const {
      fullname,
      email,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;

    // Create an update object to store fields to be updated
    let updateData = {};

    // Validate and prepare fullname
    if (fullname) {
      updateData.fullname = fullname;
    }

    // Validate and prepare email
    if (email) {
      const newEmail = email.toLowerCase();
      const emailExists = await User.findOne({ email: newEmail });

      if (emailExists) {
        return res.status(422).json({ message: "Email already exists!" });
      }

      updateData.email = newEmail;
    }

    // Validate and prepare password
    if (currentPassword && newPassword && confirmNewPassword) {
      const user = await User.findById(req.user.id);

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(422)
          .json({ message: "Current password is incorrect!" });
      }

      if (newPassword.trim().length < 6) {
        return res
          .status(422)
          .json({ message: "New password should be at least 6 characters!" });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(422).json({ message: "New passwords do not match!" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(newPassword, salt);

      updateData.password = hashPass;
    }

    // Ensure at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      return res.status(422).json({ message: "No update fields provided!" });
    }

    // Update the user in the database and fetch the updated user data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password from the returned data

    return res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// get notices
const getNoticeCtrl = async (req, res, next) => {
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

    const notices = await Notice.find({ department, noticeType: "department" }).populate({
      path: "postedBy",
    });

    // If images are stored as file paths, ensure the full URL is returned
    const fullNotices = notices.map((notice) => ({
      ...notice._doc,
      image: notice.image ? `${process.env.BASE_URL}${notice.image}` : null,
    }));

    console.log(fullNotices);
    return res.status(200).json({ notices: fullNotices });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const facultyCtrl = async (req, res, next) => {
  try {
    const {
      fullname, email, password, confirmPassword, department, semester, role
    } = req.body;

    if (!fullname || !email || !password || !role || !confirmPassword || !department || !semester) {
      return res.status(422).json({ message: "All fields are required!" });
    }

    const newEmail = email.toLowerCase();

    if (!newEmail.endsWith("@gmail.com")) {
      return res.status(422).json({ message: "Only @gmail.com emails are allowed" });
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(422).json({ message: "Email already exists" });
    }

    if (password.trim().length < 6) {
      return res.status(422).json({ message: "Password should be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const user = req.user;

    if (!user || user.role !== "admin") {
      return res.status(422).json({ message: "Only admin can register faculty members" });
    }

    if (user.department !== department) {
      return res.status(422).json({
        message: "Admin can only register its respective department faculty members",
      });
    }

    const newUser = await User.create({
      fullname,
      email: newEmail,
      department,
      semester,
      role,
      password: hashPass,
    });

    return res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const allFaculty = async (req, res) => {
  try {
    // Ensure the user is extracted from req (e.g., req.user if you're using JWT middleware)
    const user = req.user; // Assuming user is added to req in middleware
    const {role, department} = user;

    // Find all users who are students
    const teachers = await User.find({ role: "teacher", department });
    console.log(user);

    // Send response with all student data
    res.status(200).json({ status: "success", teachers });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  profilePhotCtrl,
  getNoticeCtrl,
  updateUserCtrl,
  getProfilePhotCtrl,
  facultyCtrl,
  allFaculty,
};
