import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { FaUserCircle } from "react-icons/fa";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 text-center">
              Profile Information
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
              <div className="col-span-1 flex justify-center mb-6">
                <div className="profile-picture">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="profile-img w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={100} />
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    value={user.fullname}
                    readOnly
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email Address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Role
                </label>
                <div className="mt-2">
                  <input
                    id="role"
                    name="role"
                    type="text"
                    value={user.role}
                    readOnly
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                  />
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
                  <input
                    id="department"
                    name="department"
                    type="text"
                    value={user.department}
                    readOnly
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 bg-red-500 text-white p-2 rounded">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
