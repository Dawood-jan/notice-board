import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import AnimateOnScroll from "../components/dashboard/common/AnimateOnScroll";
import axios from "axios";

const Home = () => {
  const [principalNotices, setPrincipalNotices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrincipalNotices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}notices/get-principal-notice`
        );
        setPrincipalNotices(response.data.notices || []);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Failed to fetch principal notices. Please try again later.";
        setError(errorMessage);
      }
    };
    fetchPrincipalNotices();
  }, []);
  return (
    <div className="flex flex-col bg-gray-200">
      {/* Background image section */}
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <div
          className="flex justify-center items-center relative inset-0 bg-black bg-opacity-50 z-0 h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex-col overflow-hidden px-4 lg:px-16 bg-cover bg-center"
          style={{
            backgroundImage: "url(/cs-deo.jpeg)",
          }}
        >
          {/* Marquee for Principal Notices */}
          <div className="absolute top-0 w-full bg-indigo-900 text-white z-10 p-2">
            <Link to="/all-notices" className="hover:text-white">
            <marquee>
              {principalNotices.length > 0 ? (
                principalNotices.map((notice, index) => (
                  <span key={index} className="mx-4">
                    {notice.title}
                  </span>
                ))
              ) : (
                <span>{error || "No notices available at the moment."}</span>
              )}
            </marquee></Link>
           
          </div>
          <div className="absolute inset-0 bg-black opacity-50 z-0 pointer-events-none"></div>

          <AnimateOnScroll animation="fade-left" duration={1000}>
            <div className="text-center d-flex flex-column align-items-start relative bg-opacity-60 p-6 rounded-lg z-10">
              <h1 className="text-4xl font-bold mb-2 text-white">
                Post Graduate College Charsadda
              </h1>

              {/* Typing animation using Typewriter */}
              <p className="text-lg text-white mt-4">
                <Typewriter
                  words={[
                    "Stay informed with real-time updates.",
                    "Department-specific notices tailored for you.",
                    "Semester-based announcements for students.",
                    "Student-specific notices for students.",
                  ]}
                  loop={Infinity}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-right" duration={1000}>
            <Link
              to="/login"
              className="mt-8 text-white inline-block rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium hover:bg-indigo-500"
            >
              Log In to Your Account
            </Link>
          </AnimateOnScroll>
        </div>
      </AnimateOnScroll>

      {/* Card section (outside of background image) */}
      <div className="space-y-6 mt-8 mb-8 mx-auto px-4 max-w-7xl">
        <AnimateOnScroll animation="fade-right" duration={1000}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Department Notices
            </h2>
            <p className="text-gray-600">
              Get notices relevant to your department, keeping you up-to-date
              with important announcements.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-right" duration={1000}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Email Notifications
            </h2>
            <p className="text-gray-600">
              Receive instant email alerts whenever a new notice is posted for
              your department or semester.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-right" duration={1000}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Student Notices
            </h2>
            <p className="text-gray-600">
              Easily access all notices through a simple and intuitive dashboard
              designed for both students.
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default Home;
