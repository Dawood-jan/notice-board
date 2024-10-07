import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
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
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-2xl transform transition duration-500 hover:shadow-xl m-10">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 text-center mb-4">
          All Notices
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {notices.length === 0 ? (
          <p className="text-center text-gray-600">No notices found.</p>
        ) : (
          <ul className="space-y-6">
            {notices.map((notice) => (
              <li key={notice._id} className="list-none">
                <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl">
                  {/* Image at the Top */}
                  {notice.image && (
                    <img
                      src={notice.image}
                      alt={notice.title}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  {/* Card Header with Border Bottom */}
                  <div className="p-4 border-b">
                    <h3 className="text-xl font-semibold">{notice.title}</h3>
                  </div>

                  {/* Card Body with Border Bottom */}
                  {notice.content && notice.content.trim() ? (
                    <div className="p-4 border-b bg-white">
                      <p className="text-gray-700">{notice.content}</p>
                    </div>
                  ) : null}

                  {/* Card Footer */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500">
                        Dated: {formatDate(notice.createdAt)}
                      </p>
                    </div>

                    {/* Edit and Delete Buttons */}
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                        onClick={() => handleEdit(notice)}
                      >
                        <SquarePen size={18} /> Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
                        onClick={() => handleDelete(notice._id)}
                      >
                        <MdDelete size={18} /> Delete
                      </button>
                    </div>
                  </div>
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
