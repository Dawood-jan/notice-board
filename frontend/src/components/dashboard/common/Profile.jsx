import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { FaUserCircle } from "react-icons/fa";
import FloatingShape from "../../FloatingShape";
import AnimateOnScroll from "./AnimateOnScroll";


const Profile = ({ profilePhoto }) => {
  const { auth } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/profile`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        console.log(response.data);

        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch profile data");
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [auth.token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AnimateOnScroll animation="fade-up" duration={1000}>
    <div className="flex py-5 justify-center items-center relative">
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
      <form className="max-w-xl w-full p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-3xl font-bold mb-6 text-center font-bold text-white text-transparent bg-clip-text">
          Profile Information
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="space-y-4">
          {/* Profile Picture */}
          <div className="form-group flex justify-center">
            <div className="profile-picture mb-4">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="profile-img w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle size={100} className="text-white" />
              )}
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullname" className="form-label text-white">
              Full Name
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              value={user.fullname}
              readOnly
              className="w-full pl-4 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label text-white">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={user.email}
              readOnly
              className="w-full pl-4 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200  cursor-not-allowed"
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role" className="form-label text-white">
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={user.role}
              readOnly
              className="w-full pl-4 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200  cursor-not-allowed"
            />
          </div>

          {/* Department */}
          <div className="form-group">
            <label htmlFor="department" className="form-label text-white">
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              value={user.department}
              readOnly
              className="w-full pl-4 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200  cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="mt-4 bg-red-500 text-white p-2 rounded">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
    </AnimateOnScroll>
  );
};

export default Profile;
