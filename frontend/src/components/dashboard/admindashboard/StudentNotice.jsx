import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import FloatingShape from "../../FloatingShape";
import "./Quill.css";
import AnimateOnScroll from "../common/AnimateOnScroll";
import { useParams } from "react-router-dom";

const StudentNotice = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState(""); // To store selected student ID
  const [students, setStudents] = useState([]); // To store the list of students
  const [image, setImage] = useState(null);
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");
  const quillRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
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

        // console.log(response.data);

        setStudents(response.data.students);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred while fetching notices.";
        setError(errorMessage);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    console.log("Quill ref before initialization:", quillRef.current);
    if (quillRef.current && !quillRef.current.quillInstance) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: true,
        },
      });
      quill.on("text-change", () => {
        setDescription(quill.root.innerHTML);
        console.log("Current innerHTML:", quill.root.innerHTML); // Log innerHTML
      });
      quillRef.current.quillInstance = quill;
      console.log("Quill instance initialized:", quill);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", description);
    // formData.append("department", department);
    formData.append("semester", semester);
  
    if (image) {
      formData.append("image", image);
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}notices/student-notice?studentId=${studentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data.success) {
        swal("Success", "Notice created successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        resetFields();
      } else {
        setError(response?.data?.message || "Error creating notice");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error creating notice";
      setError(errorMessage);
    }
  };

  const resetFields = () => {
    setTitle("");
    setDescription("");
    // setDepartment("");
    setStudentId(""); // Reset the student selection
    quillRef.current.quillInstance.root.innerHTML = "";
    imageInputRef.current.value = ""; // Clear the image input field
    setImage(null);
  };

  return (
    <div className="flex justify-center py-10 items-center  relative">
      {/* Floating shapes */}
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
        <form
          onSubmit={handleSubmit}
          className="max-w-xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Add Student Notice</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Other form fields */}
            <div className="form-group">
              <label htmlFor="title" className="text-light">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className=" w-full pl-5 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="text-light">
                Description
              </label>
              <div
                id="description"
                ref={quillRef}
                className="block h-52 bg-gray-800 bg-opacity-50 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              ></div>
            </div>

            <div className="form-group">
              <label htmlFor="image" className="text-light">
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                ref={imageInputRef}
                className="block w-full bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="department" className="text-light">
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-select w-full pr-3 appearance-none py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div> */}

            {/* Student Semester Dropdown */}
            <div className="form-group">
              <label htmlFor="semester" className="text-white">
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="form-select w-full pr-3 appearance-none py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              >
                <option value="">Select Semester</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            {/* Student Selection Dropdown */}
            <div className="form-group mb-4">
              <label htmlFor="studentId" className="text-light block mb-2">
                Select Student
              </label>
              <select
              name="studentId"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="form-select w-full pr-3 appearance-none py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.fullname}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Notice
              </button>
            </div>
          </div>
        </form>
      </AnimateOnScroll>
    </div>
  );
};

export default StudentNotice;
