import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import AnimateOnScroll from "../common/AnimateOnScroll";

const UpdateStudentRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/get-student/${id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        setUserData(response.data.studentData);

        setSemester(response.data.studentData.semester)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "An error occurred while fetching the student record.";
        setError(errorMessage);
      }
    };

    fetchNotice();
  }, [id, auth.token]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}users/update-student-record/${id}`,
        {
          semester,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        await swal("Success", "Student updated successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        navigate("/admin-dashboard/all-students");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the student record.";
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
   setSemester(e.target.value);
  };


  return (
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
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <div className="w-[35%] p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
          <h2 className="text-3xl font-bold mb-6 text-center text-white text-transparent bg-clip-text">
            Update Student
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="title" className="text-white">
                Name
              </label>
              <input
                type="text"
                name="title"
                value={userData.fullname}
                // onChange={handleChange}
                readOnly
                className=" w-full pl-5 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title" className="text-white">
                Email
              </label>
              <input
                type="text"
                name="title"
                value={userData.email}
                // onChange={handleChange}
                readOnly
                className=" w-full pl-5 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title" className="text-white">
                Semester
              </label>
              <input
                type="text"
                name="title"
                value={semester}
                onChange={handleChange}
                className=" w-full pl-5 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Notice
              </button>
            </div>
          </form>
        </div>
      </AnimateOnScroll>
    </div>
  );
};

export default UpdateStudentRecord;
