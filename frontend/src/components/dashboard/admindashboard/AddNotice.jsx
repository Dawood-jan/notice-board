import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const AddNotice = () => {
  const { auth } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const quillRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (quillRef.current && !quillRef.current.quillInstance) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: true,
        },
      });
      quill.on("text-change", () => {
        setDescription(quill.root.innerText);
      });
      quillRef.current.quillInstance = quill;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", description);
    formData.append("department", department);
  
    if (image) {
      formData.append("image", image);
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}notices/create-notice`,
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
        // Handle errors returned from the backend
        setError(response.data.message || "Error creating notice");
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
    setDepartment("");
    quillRef.current.quillInstance.root.innerHTML = "";
    imageInputRef.current.value = ""; // Clear the image input field
    setImage(null);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-2xl transform transition duration-500 hover:shadow-xl m-10">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 text-center mb-4">
          Add Notice
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <div
              id="description"
              ref={quillRef}
              className="block h-52 w-full rounded-md border border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            ></div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              ref={imageInputRef}
              className="block form-control w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="form-select"
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
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
        </form>
      </div>
    </div>
  );
};

export default AddNotice;
