import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const AdminPendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    // Fetch pending users
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/pending-users`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );

        console.log(response.data);
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users.");
      }
    };

    fetchPendingUsers();
  }, []);

  // Handle user approval
  const handleApprove = async (userId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}users/approve-user/${userId}`,
        { status: "Approved" }, // Empty request body
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      console.log(response.data);
      setUsers(users.filter((user) => user._id !== userId)); // Remove approved user from list
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to approve user.");
    }
  };

  // Handle user approval
  const handleReject = async (userId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}users/reject-user/${userId}`,
        { status: "Rejected" },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      setUsers(users.filter((user) => user._id !== userId)); // Remove approved user from list
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to approve user.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <p>{error}</p>

      <h1 className="text-2xl font-bold mb-6">Pending User Approvals</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Department</th>
            <th className="border border-gray-300 p-2">Semester</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{user.fullname}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.department}</td>
              <td className="border border-gray-300 p-2">{user.semester}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleApprove(user._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user._id)}
                  className="bg-red-500 text-white px-4 py-2 ml-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPendingUsers;
