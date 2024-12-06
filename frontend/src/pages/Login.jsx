import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { AuthContext } from "../components/AuthContext";
import Input from "../components/Input";
import { motion } from "framer-motion";
import AnimateOnScroll from "../components/dashboard/common/AnimateOnScroll";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}users/login`,
        userData
      );

      const { token, id, fullname, role, department, email, semester } =
        response.data;

      if (!token) {
        setError("Login failed. Please try again.");
        return;
      }

      const authData = {
        token,
        id,
        fullname,
        role,
        department,
        email,
        semester,
      };
      login(authData);
      localStorage.setItem("auth", JSON.stringify(authData));

      if (role === "admin" || role === "teacher" || role === "principal") {
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

  return (
    <div className="flex py-5 justify-center items-center bg-gray-200 flex flex-col relative">
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <form
          className="w-[28%] bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
          onSubmit={loginUser}
        >
          <div className="p-8">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-3xl font-bold mb-6 text-center text-white text-transparent bg-clip-text">
                Login
              </h2>
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mt-4 grid grid-cols-1 gap-x-6">
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
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group position-relative">
                  <label htmlFor="password" className="text-light">
                    Password <span className="text-red-600">*</span>
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
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
          >
            Login
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
      </AnimateOnScroll>
    </div>
  );
};

export default Login;
