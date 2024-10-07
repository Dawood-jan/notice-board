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
      <form className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullname" className="form-label">
              Full Name
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              value={formData.fullname}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter a new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm your new password"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary py-2 px-4 text-white rounded-lg flex items-center gap-2"
          >
            <SquarePen size={18} />
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
