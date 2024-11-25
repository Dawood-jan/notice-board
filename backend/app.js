require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const upload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const User = require("./models/User");
const userRoute = require("./routes/userRoute");
const noticeRoute = require("./routes/noticeRoute");
const contactRoute = require("./routes/contactRoute");
require("./config/dbConnection");


const app = express();

app.use(cors());
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files middleware
app.use(upload({
  useTempFiles: false,
}));
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
      status: "Approved"

    },
    {
      fullname: "Aizaz",
      email: "adminphy@gmail.com",
      password: "Admin_phy_12",
      department: "Physics",
      role: "admin",
      status: "Approved"

    },

    {
      fullname: "Aizaz",
      email: "adminche@gmail.com",
      password: "Admin_che_12",
      department: "Chemistry",
      role: "admin",
      status: "Approved"
    },
    {
      fullname: "Fazle Subhan",
      email: "principal@gmail.com",
      password: "Principal_12",
      role: "principal",
      status: "Approved"
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
app.use("/contact", contactRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
