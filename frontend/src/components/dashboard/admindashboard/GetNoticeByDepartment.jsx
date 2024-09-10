import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { SquarePen } from "lucide-react";

const GetNoticeByDepartment = () => {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}notices/department`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
            params: {
              department: auth.department,
            },
          }
        );

        console.log(response.data.notices);

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
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (notice) => {
    navigate(`/admin-dashboard/edit-notice/${notice._id}`, {
      state: { notice },
    });
  };

  const handleDelete = (noticeId) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete this file!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes, delete it!",
          className: "btn btn-success",
        },
        cancel: {
          visible: true,
          className: "btn btn-danger",
        },
      },
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${import.meta.env.VITE_BASE_URL}notices/delete-notice/${noticeId}`,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          )
          .then(() => {
            setNotices(notices.filter((notice) => notice._id !== noticeId));
            swal({
              title: "Deleted!",
              text: "Your notice has been deleted.",
              icon: "success",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            });
          })
          .catch((err) => {
            const errorMessage =
              err.response?.data?.message ||
              "An error occurred while deleting the notice.";
            setError(errorMessage);
          });
      } else {
        swal.close();
      }
    });
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

                <p className="text-base text-gray-700 mt-2">{notice.content}</p>

                {notice.image && (
                  <img
                    src={notice.image}
                    alt={notice.title}
                    className="w-full h-48 object-cover mt-2 rounded"
                  />
                )}

                <p className="text-sm text-gray-500 mt-2 text-end">
                  Dated: {formatDate(notice.createdAt)}
                </p>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-white py-2 px-3 rounded hover:bg-blue-600 flex items-center"
                    onClick={() => handleEdit(notice)}
                  >
                    <SquarePen className="mr-2 text-lg" /> Edit
                  </button>
                  <button
                    className="bg-red-500 font-semibold text-white py-2 px-3 rounded hover:bg-red-600 flex items-center"
                    onClick={() => handleDelete(notice._id)}
                  >
                    <MdDelete className="mr-2 text-lg" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GetNoticeByDepartment;
