import axios from "axios";
import React, { useState } from "react";
import { Eye, EyeOff  } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

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

      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred during registration.";
      setError(errorMessage);
    }
  };

  const resetFields = () => {
    setUserData({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
    });
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md" onSubmit={registerUser}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Register
            </h2>

            {error && <p className="bg-red-500 text-white p-2 rounded">{error}</p>}

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
              <div className="col-span-1">
                <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900">
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    value={userData.fullname}
                    onChange={changeInput}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  />
                </div>
              </div>
              {/* fullname ends here */}
              <div className="col-span-1">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={changeInput}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  />
                </div>
              </div>
              {/* email ends here */}
              <div className="col-span-1 relative">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"} // Toggle between text and password
                    value={userData.password}
                    onChange={changeInput}
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
              {/* password ends here */}
              <div className="col-span-1 relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"} // Toggle between text and password
                    value={userData.confirmPassword}
                    onChange={changeInput}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                  >
                     {confirmPasswordVisible ? (
                      <EyeOff className="size-6" />
                    ) : (
                      <Eye className="size-6" />
                    )}
                  </button>
                </div>
              </div>
              {/* confirm password ends here */}
              <div className="col-span-1">
                <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                  Department
                </label>
                <div className="mt-2">
                  <select
                    id="department"
                    name="department"
                    value={userData.department}
                    onChange={changeInput}
                    autoComplete="department"
                    className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-base sm:leading-6"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>
              </div>
              {/* department ends here */}
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
            Register
          </button>
        </div>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Already have an account? Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
