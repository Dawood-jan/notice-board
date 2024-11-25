import React, { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AnimateOnScroll from "../components/dashboard/common/AnimateOnScroll";

const Contact = () => {
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const resetFields = () => {
    setUserData({
      fullname: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}contact/contact-us`,
        userData
      );

      if (response.data.success) {
        await swal("Success", "Notice created successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });

        resetFields();
      } else {
        setError(response.data.message || "Error creating notice");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      setError(errorMessage);
    }
  };

  return (
    <div className="flex py-5 justify-center items-center bg-gray-200  flex flex-col relative">
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <form
          className="w-[32%] bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="p-8">
            <div className="border-b border-gray-900/10">
              <h2 className="text-3xl font-bold mb-6 text-center text-white text-transparent bg-clip-text">
                Contact Us
              </h2>
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mt-4 grid grid-cols-1 gap-x-6">
                <div className="form-group">
                  <label htmlFor="fullname" className="text-light">
                    Name
                  </label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    placeholder="Enter Fullname"
                    value={userData.fullname}
                    className="w-full pl-4 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="text-light">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={userData.email}
                    className="w-full pl-4 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group position-relative">
                  <label htmlFor="subject" className="text-light">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full pl-4 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                    value={userData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                  />
                </div>

                <div className="form-group position-relative">
                  <label htmlFor="subject" className="text-light">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    className="w-full pl-4 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                    value={userData.message}
                    placeholder="Enter Your Message"
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
          >
            Send
          </motion.button>
        </form>
      </AnimateOnScroll>
    </div>
  );
};

export default Contact;
