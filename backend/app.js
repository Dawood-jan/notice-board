require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const upload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const User = require("./models/User");
const userRoute = require("./routes/userRoute");
const noticeRoute = require("./routes/noticeRoute");
require("./config/dbConnection");

const app = express();

app.use(cors());
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL and port
  optionsSuccessStatus: 200,
};

app.use(express.urlencoded({ extended: true }));

app.use(express.json({ extended: true }));

app.use(upload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create default admin users
const createAdminUsers = async () => {
  const admins = [
    {
      fullname: "Manzoor",
      email: "admincs@gmail.com",
      password: "Admin_cs_12",
      department: "Computer Science",
      role: "admin",
    },
    {
      fullname: "Aizaz",
      email: "adminphy@gmail.com",
      password: "Admin_phy_12",
      department: "Physics",
      role: "admin",
    },

    {
      fullname: "Aizaz",
      email: "adminche@gmail.com",
      password: "Admin_che_12",
      department: "Chemistry",
      role: "admin",
    },
  ];

  for (const admin of admins) {
    let user = await User.findOne({ email: admin.email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);
      user = new User(admin);
      await user.save();
      console.log(`Admin ${admin.email} created`);
    }
  }
};

createAdminUsers();

app.use("/users", userRoute);
app.use("/notices", noticeRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
