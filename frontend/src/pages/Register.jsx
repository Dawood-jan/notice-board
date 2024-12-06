import axios from "axios";
import { motion } from "framer-motion";
import React, { useState, useContext } from "react";
import {
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  User,
  Building,
  BookAIcon,
  Users,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import { AuthContext } from "../components/AuthContext";
import Select from "../components/Select";
import AnimateOnScroll from "../components/dashboard/common/AnimateOnScroll";

const Register = () => {
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const { isLoading } = useContext(AuthContext);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const changeInput = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });

    // Real-time password strength validation
    if (e.target.name === "password") {
      validatePasswordStrength(e.target.value);
    }
  };

  const validatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    // const strongRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    // if (strongRegex.test(password)) {
    //   setPasswordStrength("strong");
    // } else if (mediumRegex.test(password)) {
    //   setPasswordStrength("medium");
    // } else {
    //   setPasswordStrength("weak");
    // }
  };

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}users/register`,
        userData
      );

      const newUser = response.data;
      if (!newUser) {
        setError("Couldn't register a user. Please try again.");
        return;
      }

      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred during registration.";
      setError(errorMessage);
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="flex py-5 justify-center items-center bg-gray-200 flex flex-col relative">
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <form
          className="w-[34%] bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
          onSubmit={registerUser}
        >
          <div className="p-8">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-3xl font-bold mb-6 text-center text-white  text-transparent bg-clip-text">
                Create Account
              </h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mt-4 grid grid-cols-1 gap-x-6">
                <div className="form-group">
                  <label htmlFor="fullname" className="text-light">
                    Full Name <span className="text-red-600">*</span>
                  </label>

                  <Input
                    icon={User}
                    id="fullname"
                    name="fullname"
                    type="text"
                    placeholder="Full Name"
                    value={userData.fullname}
                    onChange={changeInput}
                  />
                </div>
                {/* fullname ends here */}

                <div className="form-group">
                  <label htmlFor="email" className="text-light">
                    Email address <span className="text-red-600">*</span>
                  </label>

                  <Input
                    icon={Mail}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={userData.email}
                    onChange={changeInput}
                  />
                </div>
                {/* email ends here */}

                <div className="form-group position-relative">
                  <label htmlFor="password" className="text-light">
                    Password <span className="text-red-600">*</span>
                  </label>

                  <Input
                    icon={Lock}
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Password"
                    value={userData.password}
                    onChange={changeInput}
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-light pt-4"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <EyeOff size="20" /> : <Eye size="20" />}
                  </button>
                </div>
                {/* password ends here */}

                <div className="form-group relative">
                  <label htmlFor="confirmPassword" className="text-light">
                    Confirm Password <span className="text-red-600">*</span>
                  </label>

                  <Input
                    icon={Lock}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={userData.confirmPassword}
                    onChange={changeInput}
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
                    icon={Users}
                    id="role"
                    name="role"
                    value={userData.role}
                    onChange={changeInput}
                  >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                  </Select>
                </div> */}
                {/* role ends here */}

                <div className="form-group">
                  <label htmlFor="department" className="text-light">
                    Department <span className="text-red-600">*</span>
                  </label>

                  <Select
                    icon={Building}
                    id="department"
                    name="department"
                    value={userData.department}
                    onChange={changeInput}
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Sacience</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </Select>
                </div>
                {/* department ends here */}

                {/* <div className="form-group">
                  <label htmlFor="semester" className="text-light">
                    Semester <span className="text-red-600">*</span>
                  </label>

                  <Select
                    icon={BookAIcon}
                    id="semester"
                    name="semester"
                    value={userData.semester}
                    onChange={changeInput}
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </Select>
                </div> */}
                {/* semester ends here */}
              </div>
            </div>

            <div className="mt-4">
              <p
                className={`mb-1 text-sm ${
                  /^(?=.*[a-z])(?=.*[A-Z]).+$/.test(userData.password)
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                • Must contain at least one uppercase and one lowercase letter.
              </p>
              <p
                className={`mb-1 text-sm ${
                  /(?=.*\d).+$/.test(userData.password)
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                • Must contain at least one number.
              </p>
              <p
                className={`mb-1 text-sm ${
                  /(?=.*[@$!%*?&]).+$/.test(userData.password)
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                • Must include at least one special character (e.g., @$!%*?&).
              </p>
              <p
                className={`text-sm ${
                  userData.password.length >= 6
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                • Must be at least 6 characters long.
              </p>
            </div>
          </div>

          <motion.button
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
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
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to={"/login"} className="text-green-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </AnimateOnScroll>
    </div>
  );
};

export default Register;


// asdfsf@gmail.com

// Da12@$