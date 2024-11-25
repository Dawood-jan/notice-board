import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Building,
  User,
  BookAIcon,
  User2,
} from "lucide-react";
import Input from "../../Input";
import Select from "../../Select";
import FloatingShape from "../../FloatingShape";
import { motion } from "framer-motion";
import AnimateOnScroll from "../common/AnimateOnScroll";

const AddFaculty = () => {
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    // department: "",
    // semester: "",
    // role: "",
  });

  const { isLoading, auth } = useContext(AuthContext);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const createUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}users/faculty`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.data.status) {
        swal("Success", "Faculty created successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        resetFields();
      } else {
        setError(response.data.message || "Error creating faculty");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred.";
      setError(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const resetFields = () => {
    setUserData({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      // department: "",
      // role: "",
      // semester: "",
    });
  };

  return (
    <div className="flex py-5 justify-center items-center  min-h-screen relative overflow-hidden">
      {/* <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      /> */}
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <div className="max-w-xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
          <h2 className="text-3xl font-bold text-white text-center mb-4 pt-4">
            Add Faculty
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={createUser} id="createFacultyForm">
            <div className="border-b border-gray-900/10 pb-12 p-8">
              <div className="grid grid-cols-1 gap-x-6">
                <div className="form-group">
                  <label htmlFor="fullname" className="text-light">
                    Fullname
                  </label>
                  <Input
                    icon={User2}
                    iid="fullname"
                    name="fullname"
                    type="text"
                    placeholder="Fullname"
                    value={userData.fullname}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="text-light">
                    Email address
                  </label>
                  <Input
                    icon={Mail}
                    iid="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group position-relative">
                  <label htmlFor="password" className="text-light">
                    Password
                  </label>
                  <Input
                    icon={Lock}
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-4 pt-4 text-light"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <EyeOff size="20" /> : <Eye size="20" />}
                  </button>
                </div>

                <div className="form-group relative">
                  <label htmlFor="confirmPassword" className="text-light">
                    Confirm Password
                  </label>

                  <Input
                    icon={Lock}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-light pt-4"
                  >
                    {confirmPasswordVisible ? (
                      <EyeOff size="20" />
                    ) : (
                      <Eye size="20" />
                    )}
                  </button>
                </div>
                {/* confirm password ends here */}

                {/* <div className="form-group">
                <label htmlFor="role" className="text-light">
                  Role
                </label>
                <Select
                  icon={User}
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="teacher">Teacher</option>
                </Select>
              </div> */}

                {/* <div className="form-group position-relative">
                <label htmlFor="semester" className="text-light">
                  Semester
                </label>
                <Select
                  icon={BookAIcon}
                  id="semester"
                  name="semester"
                  value={userData.semester}
                  onChange={handleChange}
                >
                  <option value="">Select Semester</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="8">8</option>
                </Select>
              </div> */}

                {/* <div className="form-group">
                <label htmlFor="department" className="text-light">
                  Department
                </label>
                <Select
                  icon={Building}
                  id="department"
                  name="department"
                  value={userData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </Select>
              </div> */}
              </div>
            </div>
          </form>
          <motion.button
            form="createFacultyForm"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className=" animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </div>
      </AnimateOnScroll>
    </div>
  );
};

export default AddFaculty;
