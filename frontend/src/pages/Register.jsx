import axios from "axios";
import { motion } from "framer-motion";
import React, { useState, useContext } from "react";
import { Eye, EyeOff, Loader, Lock, Mail, User, Building } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import FloatingShape from "../components/FloatingShape";
import Input from "../components/Input";
import { AuthContext } from "../components/AuthContext";
import Select from "../components/Select";

const Register = () => {
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const { isLoading } = useContext(AuthContext);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const changeInput = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
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

  // const resetFields = () => {
  //   setUserData({
  //     fullname: "",
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //     department: "",
  //   });
  // };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div
      className="flex py-5 justify-center items-center bg-gradient-to-br min-h-screen
    from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden"
    >
      <FloatingShape
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
      />

      <motion.div
        className="max-w-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form
          className="max-w-lg w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
          onSubmit={registerUser}
        >
          <div className="p-8">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                Create Account
              </h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mt-4 grid grid-cols-1 gap-x-6">
                <div className="form-group">
                  <label htmlFor="fullname" className="text-light">
                    Full Name
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
                    Email address
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
                    Password
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
                    Confirm Password
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

                <div className="form-group">
                  <label htmlFor="department" className="text-light">
                    Department
                  </label>

                  <Select
                    icon={Building}
                    id="department"
                    name="department"
                    value={userData.department}
                    onChange={changeInput}
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    <option value="Computer Science">Computer Sacience</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </Select>
                </div>
                {/* department ends here */}
              </div>
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
      </motion.div>
    </div>
  );
};

export default Register;
