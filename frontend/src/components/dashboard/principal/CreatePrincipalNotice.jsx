import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import "../admindashboard/Quill.css";
import AnimateOnScroll from "../common/AnimateOnScroll";

const CreatePrincipalNotice = () => {
  const { auth } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const quillRef = useRef(null);
  const imageInputRef = useRef(null);

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
        const editorContent = quill.root.innerHTML;
        if (editorContent === "<p><br></p>") {
          setDescription("");
        } else {
          console.log(quill.root.innerHTML);
          setDescription(quill.root.innerHTML);
        }
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

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}notices/add-principal-notice`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

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
        console.log(response);
        setError(response.data.message || "Error creating notice");
      }
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "Error creating notice";
      setError(errorMessage);
    }
  };

  const resetFields = () => {
    setTitle("");
    setDescription("");
    quillRef.current.quillInstance.root.innerHTML = "";
    imageInputRef.current.value = ""; // Clear the image input field
    setImage(null);
  };

  return (
    <div className="flex justify-center py-10 items-center  relative overflow-hidden">
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <form
          onSubmit={handleSubmit}
          className=" w-[42%] bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl "
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Add Notice
            </h2>
            {error && <div className="alert alert-danger">{error}</div>}
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
                className="block h-52 bg-gray-800 bg-opacity-50  border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
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

export default CreatePrincipalNotice;
