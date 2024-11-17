import React from "react";
import { Link } from "react-router-dom";
import FloatingShape from "../components/FloatingShape";
import { Typewriter } from "react-simple-typewriter";
import AnimateOnScroll from "../components/dashboard/common/AnimateOnScroll";

const Home = () => {
  return (
    <div
      className="flex min-h-screen
     bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex flex-col relative overflow-hidden"
    >
      {/* Background image section */}
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <div
          className="flex py-5 justify-center absolute inset-0 bg-black bg-opacity-50 z-0 items-start h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex-col relative overflow-hidden px-4 lg:px-16 bg-cover bg-center"
          style={{
            backgroundImage: "url(/computer%20science.jpg)",
          }}
        >
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

          <AnimateOnScroll animation="fade-left" duration={1000}>
            <div className="relative mb-4 bg-opacity-60 p-6 rounded-lg">
              <h1 className="text-4xl font-bold mb-2 text-white relative z-10">
                Welcome to the Online Notice Board
              </h1>

              {/* Typing animation using Typewriter */}
              <p className="text-lg text-white mt-4">
                <Typewriter
                  words={[
                    "Stay informed with real-time updates.",
                    "Department-specific notices tailored for you.",
                    "Semester-based announcements for students.",
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
              className="mt-4 text-white inline-block rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium hover:bg-indigo-500"
            >
              Log In to Your Account
            </Link>
          </AnimateOnScroll>
        </div>
      </AnimateOnScroll>
      {/* Card section (outside of background image) */}
      <div className="flex gap-4 justify-center mt-8 mb-8 max-w-5xl mx-auto flex-wrap lg:flex-nowrap">
        <AnimateOnScroll animation="fade-right" duration={1000}>
          <div className="w-72 p-4 bg-indigo-500 bg-opacity-75 rounded-md">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Department Notices
            </h2>
            <p className="text-sm text-white">
              Get notices relevant to your department, keeping you up-to-date
              with important announcements.
            </p>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-down" duration={1000}>
          <div className="w-72 p-4 bg-indigo-500 bg-opacity-75 rounded-md">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Email Notifications
            </h2>
            <p className="text-sm text-white">
              Receive instant email alerts whenever a new notice is posted for
              your department or semester.
            </p>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-left" duration={1000}>
          <div className="w-72 p-4 bg-indigo-500 bg-opacity-75 rounded-md">
            <h2 className="text-xl font-semibold mb-2 text-white">
              User-Friendly Interface
            </h2>
            <p className="text-sm text-white">
              Easily access all notices through a simple and intuitive dashboard
              designed for both students and admins.
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default Home;
