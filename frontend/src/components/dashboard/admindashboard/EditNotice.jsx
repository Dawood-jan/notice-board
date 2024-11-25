import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import AnimateOnScroll from "../common/AnimateOnScroll";
import FloatingShape from "../../FloatingShape";


const EditNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const { notice: initialNotice } = location.state || {
    notice: { title: "", content: "", image: null },
  };
  const [notice, setNotice] = useState(initialNotice);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    if (initialNotice && !initialNotice.title && !initialNotice.content) {
      const fetchNotice = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}notices/${id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );

          setNotice(response.data);
        } catch (err) {
          const errorMessage =
            err.response?.data?.message ||
            "An error occurred while fetching the notice.";
          setError(errorMessage);
        }
      };

      fetchNotice();
    }
  }, [id, auth.token, initialNotice]);

  useEffect(() => {
    if (quillRef.current && !quillRef.current.quillInstance) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: true,
        },
      });

      quill.on("text-change", () => {
        setNotice((prevNotice) => ({
          ...prevNotice,
          content: quill.root.innerHTML, // Use innerHTML to get the formatted content
        }));
      });

      quillRef.current.quillInstance = quill;

      // Set initial content if available
      if (notice.content) {
        quill.clipboard.dangerouslyPasteHTML(notice.content);
      }
    }
  }, [notice.content]); // Dependency array includes `notice.content`

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Form data to handle image upload
    const formData = new FormData();
    formData.append("title", notice.title);
    formData.append("content", notice.content); // Ensure content is taken from the state

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}notices/update-notice/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        await swal("Success", "Notice updated successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        navigate("/admin-dashboard/all-notices");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the notice.";
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotice((prevNotice) => ({
      ...prevNotice,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
      <div className="max-w-xl p-8 w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-3xl font-bold mb-6 text-center text-white text-transparent bg-clip-text">
          Edit Notice
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="title" className="text-white">Title</label>
            <input
              type="text"
              name="title"
              value={notice.title}
              onChange={handleChange}
              autoFocus // Add this line to autofocus the title input
              className=" w-full pl-5 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="description"
              className="block text-white"
            >
              Description
            </label>
            <div className="mt-2">
              <div
                id="description"
                ref={quillRef}
                className="block h-52 w-full border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              ></div>
            </div>
          </div>

          {/* Display existing image */}
          {notice.image && (
            <div className="form-group">
              <label htmlFor="" className="text-white">Current Image</label>
              <img
                src={notice.image}
                alt="Notice Attachment"
                className="max-w-full h-auto rounded-md mb-2"
              />
            </div>
          )}

          {/* Image upload input */}
          <div className="form-group">
            <label htmlFor="image" className="text-white">Upload Image</label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              className="block w-full bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
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

export default EditNotice;
