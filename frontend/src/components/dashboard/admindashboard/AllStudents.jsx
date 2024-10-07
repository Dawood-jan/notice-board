import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const AllStudents = () => {
  const [studentData, setStudentData] = useState([]);

  const [error, setError] = useState("");
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div className="overflow-x-auto max-w-4xl mx-auto mt-10">
    {error && <div className="alert alert-danger">{error}</div>}
    <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-x;"> {/* Rounded-lg for the entire table */}
      <thead className="bg-gray-400"> {/* Removed rounded-t-lg */}
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
              {student.email}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  );
  
  
};

export default AllStudents;
