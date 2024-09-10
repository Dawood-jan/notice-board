import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff  } from 'lucide-react';
import { AuthContext } from "../components/AuthContext";

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
  const { login } = useContext(AuthContext);

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

  const resetFields = () => {
    setUserData({
      email: "",
      password: "",
      department: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md"
        onSubmit={loginUser}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Login
            </h2>
            {error && (
              <p className="bg-red-500 text-white p-2 rounded">{error}</p>
            )}

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
              <div className="col-span-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    value={userData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                  >
                    {passwordVisible ? (
                      <EyeOff className="size-6" />
                    ) : (
                      <Eye className="size-6" />
                    )}
                  </button>
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Department
                </label>
                <div className="mt-2">
                  <select
                    id="department"
                    name="department"
                    value={userData.department}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-base sm:leading-6"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
          onClick={resetFields}
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Login
          </button>
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/register"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Don't have an account? Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
