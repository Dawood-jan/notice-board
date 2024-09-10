import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

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
          content: quill.root.innerText, // Use innerHTML to get the formatted content
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold leading-7 text-gray-900 text-center mb-4">
          Edit Notice
        </h2>
        {error && (
          <p className="bg-red-500 text-white p-2 rounded mb-4">{error}</p>
        )}
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              name="title"
              value={notice.title}
              onChange={handleChange}
              autoFocus // Add this line to autofocus the title input
              className="block h-12 w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Description
            </label>
            <div className="mt-2">
              <div
                id="description"
                ref={quillRef}
                className="block h-52 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ></div>
            </div>
          </div>

          {/* Display existing image */}
          {notice.image && (
            <div className="mb-4">
              <p className="text-sm text-gray-700">Current image: </p>
              <img
                src={notice.image}
                alt="Notice Attachment"
                className="max-w-full h-auto rounded-md mb-2"
              />
            </div>
          )}

          {/* Image upload input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload New Image:
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
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
    </div>
  );
};

export default EditNotice;
