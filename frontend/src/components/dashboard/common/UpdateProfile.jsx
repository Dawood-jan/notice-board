import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { SquarePen } from "lucide-react";

const UpdateProfile = () => {
  const { auth, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}users/update-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      updateProfile(response.data.data); // Update context with the returned user data
      setError(""); // Clear error message
      setFormData((prevData) => ({
        ...prevData,
        email: "",
        fullname: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));

      swal("", "Profile updated successfully!", {
        icon: "success",
        buttons: {
          confirm: {
            className: 'btn btn-success'
          }
        },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while updating the profile.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 text-center">
              Update Profile
            </h2>

            {error && (
              <p className="mt-4 bg-red-500 text-white p-2 rounded">{error}</p>
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
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
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
                    autoComplete="name"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Current Password
                </label>
                <div className="mt-2">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New Password
                </label>
                <div className="mt-2">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm New Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-white py-2 px-3 rounded hover:bg-blue-600 flex items-center"
          >
            <SquarePen className="mr-2 size-6" />
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
