import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import FloatingShape from "../../FloatingShape";
import AnimateOnScroll from "../common/AnimateOnScroll";
import { useParams } from "react-router-dom";

const StudentNotice = () => {
  const { id } = useParams();
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}notices/student-notice`, {
            headers: { Authorization: `Bearer ${auth.token}` },
            params: { studentId: auth.studentId } // Make sure to include student ID in request
          });

        console.log(response.data);

        const sortedNotices = response.data.notices.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotices(sortedNotices);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching notices.");
      }
    };
  
    fetchNotices();
  }, [auth.token, id]);
  

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex py-5 justify-center items-center bg-gradient-to-br min-h-screen from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      <FloatingShape
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
      />
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <div className="max-w-xl w-full p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Notices
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}

          {notices.length === 0 ? (
            <p className="text-center text-white text-lg">No notices found.</p>
          ) : (
            <ul className="space-y-6">
              {notices.map((notice) => (
                <AnimateOnScroll animation="fade-right" duration={1000}>
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
                        <h3 className="text-xl font-semibold">
                          {notice.title}
                        </h3>
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
                            Posted By:{" "}
                            {notice.postedBy?.fullname ||
                              notice.postedBy?.name ||
                              "No name available"}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-gray-500">
                            Dated: {formatDate(notice.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </AnimateOnScroll>
              ))}
            </ul>
          )}
        </div>
      </AnimateOnScroll>
    </div>
  );
};

export default StudentNotice;
