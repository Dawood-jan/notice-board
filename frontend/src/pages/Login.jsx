import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader, Lock, Mail, Building } from "lucide-react";
import { AuthContext } from "../components/AuthContext";
import Input from "../components/Input";
import Select from "../components/Select";
import FloatingShape from "../components/FloatingShape";
import { motion } from "framer-motion";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    department: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isLoading } = useContext(AuthContext);

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}users/login`,
        userData
      );

      const { token, id, fullname, role, department, email } = response.data;
      if (!token) {
        setError("Login failed. Please try again.");
        return;
      }

      // Validate role
      if (!["admin", "student"].includes(role)) {
        setError("Invalid role. Please contact support.");
        return;
      }

      login({ token, id, fullname, role, department, email });

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "student") {
        navigate("/student-dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred during login.";
      setError(errorMessage);
    }
  };

  // const resetFields = () => {
  //   setUserData({
  //     email: "",
  //     password: "",
  //     department: "",
  //   });
  // };

  return (
    <div
      className="flex justify-center items-center bg-gradient-to-br min-h-screen
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
          onSubmit={loginUser}
        >
          <div className="p-8">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                Login
              </h2>
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mt-4 grid grid-cols-1 gap-x-6">
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
                {/* password ends here */}

                <div className="form-group">
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
