import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const GetNotice = () => {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/notices`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
            params: {
              department: auth.department, // Send department as a query parameter
            },
          }
        );
        setNotices(response.data.notices);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "An error occurred while fetching notices.";
        setError(errorMessage);
      }
    };

    fetchNotices();
  }, [auth.token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold leading-7 text-gray-900 text-center mb-4">
          Notices
        </h2>

        {error && (
          <p className="bg-red-500 text-white p-2 rounded mb-4">{error}</p>
        )}

        {notices.length === 0 ? (
          <p className="text-center text-gray-500">No notices found.</p>
        ) : (
          <ul className="space-y-4">
            {notices.map((notice) => (
              <li
                key={notice._id}
                className="p-4 bg-gray-100 rounded-md shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {notice.title}
                </h3>
                <p className="text-base text-gray-700">{notice.content}</p>
                <p className="text-sm text-gray-500 mt-2 text-end">
                  Dated: {formatDate(notice.createdAt)}
                </p>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GetNotice;
