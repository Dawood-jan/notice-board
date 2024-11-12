import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import FloatingShape from "../../FloatingShape";
import AnimateOnScroll from "../common/AnimateOnScroll";

const AllStudents = () => {
  const [studentData, setStudentData] = useState([]);

  const [error, setError] = useState("");
  const { auth } = useContext(AuthContext);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}notices/all-students`, // Add backticks
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Add backticks
          },
        }
      );

      console.log(response.data);
      setStudentData(response.data.students);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching notices.";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    fetchStudents(); // Fetch students when the component mounts
  }, []);

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
      {error && <div className="alert alert-danger">{error}</div>}
      {studentData.length === 0 ? (
        <p className="text-center text-white text-lg">No student found.</p>
      ) : (
        <AnimateOnScroll animation="fade-right" duration={1000}>
          <table className=" max-w-xl bg-white border border-gray-300 shadow-md rounded-x;">
            {" "}
            {/* Rounded-lg for the entire table */}
            <thead className="bg-gray-400">
              {" "}
              {/* Removed rounded-t-lg */}
              <tr>
                <th className="border px-6 py-3 text-left text-lg font-bold text-white uppercase tracking-wider">
                  Id
                </th>
                <th className="border px-6 py-3 text-left text-lg font-bold text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="border px-6 py-3 text-left text-lg font-bold text-white uppercase tracking-wider">
                  Department
                </th>
                <th className="border px-6 py-3 text-left text-lg font-bold text-white uppercase tracking-wider">
                  Semester
                </th>
                <th className="border px-6 py-3 text-left text-lg font-bold text-white uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentData.map((student, index) => (
                <tr
                  key={student._id} // Ensure each row has a unique key
                  className={`hover:bg-gray-100 transition-colors duration-300 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="border px-6 py-4 whitespace-nowrap text-base text-gray-700">
                    {student._id}
                  </td>
                  <td className="border px-6 py-4 whitespace-nowrap text-base text-gray-700">
                    {student.fullname}
                  </td>
                  <td className="border px-6 py-4 whitespace-nowrap text-base text-gray-700">
                    {student.department}
                  </td>
                  <td className="border px-6 py-4 whitespace-nowrap text-base text-gray-700">
                    {student.semester}
                  </td>
                  <td className="border px-6 py-4 whitespace-nowrap text-base text-gray-700">
                    {student.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AnimateOnScroll>
      )}
    </div>
  );
};

export default AllStudents;
