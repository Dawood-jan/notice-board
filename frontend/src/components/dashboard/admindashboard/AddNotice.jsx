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

  useEffect(() => {
    if (quillRef.current && !quillRef.current.quillInstance) {
      const quill = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: true
        }
      });
      quill.on('text-change', () => {
        setDescription(quill.root.innerText);
      });
      quillRef.current.quillInstance = quill;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", description);
    formData.append("department", department);

    if (image) {
      formData.append("image", image);
    }

    console.log(image);

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

      console.log(response.data);


      if (response.data.success) {
        swal("Success", "Notice created successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: 'btn btn-success'
            }
          },
        });

        setTitle("");
        setDescription("");
        setDepartment("");
        setImage(null);
        quillRef.current.quillInstance.root.innerHTML = "";
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error creating notice";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add Notice
            </h2>
            {error && <p className="bg-red-500 text-white p-2 rounded">{error}</p>}

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
              <div className="col-span-1">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
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

              <div className="col-span-1">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image
                </label>
                <div className="mt-2">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Department
                </label>
                <div className="mt-2">
                  <select
                    id="department"
                    name="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-base sm:leading-6"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNotice;
