import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { auth, logout } = useContext(AuthContext);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-700 py-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white">
              <img
                src="/notice-board.png"
                alt="Notice Board Icon"
                className="h-18 w-20"
              />
            </Link>
          </div>

          {/* Middle Navigation Links */}
          <div className="hidden sm:block flex-1 text-center">
            <div className="flex justify-center space-x-4">
              <Link
                to="/"
                className={`${
                  location.pathname === "/"
                    ? "bg-indigo-400 text-white"
                    : "text-white hover:bg-indigo-400 hover:text-white"
                } px-4 py-2 rounded-md text-base font-medium`}
              >
                Home
              </Link>
              <Link
                to="/all-notices"
                className={`${
                  location.pathname === "/all-notices"
                    ? "bg-indigo-400 text-white"
                    : "text-white hover:bg-indigo-400 hover:text-white"
                } px-4 py-2 rounded-md text-base font-medium`}
              >
                All Notices
              </Link>
              <Link
                to="/about"
                className={`${
                  location.pathname === "/about"
                    ? "bg-indigo-400 text-white"
                    : "text-white hover:bg-indigo-400 hover:text-white"
                } px-4 py-2 rounded-md text-base font-medium`}
              >
                About Us
              </Link>
              <Link
                to="/contact-us"
                className={`${
                  location.pathname === "/contact-us"
                    ? "bg-indigo-400 text-white"
                    : "text-white hover:bg-indigo-400 hover:text-white"
                } px-4 py-2 rounded-md text-base font-medium`}
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right-side Buttons */}
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              <Link
                to="/register"
                className={`${
                  location.pathname === "/register"
                    ? "bg-indigo-400 text-white"
                    : "text-white hover:bg-indigo-400 hover:text-white"
                } px-4 py-2 rounded-md text-base font-medium`}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className={`${
                  location.pathname === "/login"
                    ? "bg-indigo-400 text-white"
                    : "text-white hover:bg-indigo-400 hover:text-white"
                } px-4 py-2 rounded-md text-base font-medium`}
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`${
                location.pathname === "/"
                  ? "bg-indigo-400 text-white"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              } block px-4 py-2 rounded-md text-base font-medium`}
              onClick={handleMenuClick}
            >
              Home
            </Link>
            <Link
              to="/all-notices"
              className={`${
                location.pathname === "/all-notices"
                  ? "bg-indigo-400 text-white"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              } block px-4 py-2 rounded-md text-base font-medium`}
              onClick={handleMenuClick}
            >
              All Notices
            </Link>
            <Link
              to="/about"
              className={`${
                location.pathname === "/about"
                  ? "bg-indigo-400 text-white"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              } block px-4 py-2 rounded-md text-base font-medium`}
              onClick={handleMenuClick}
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              className={`${
                location.pathname === "/contact-us"
                  ? "bg-indigo-400 text-white"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              } block px-4 py-2 rounded-md text-base font-medium`}
              onClick={handleMenuClick}
            >
              Contact Us
            </Link>
            <Link
              to="/register"
              className={`${
                location.pathname === "/register"
                  ? "bg-indigo-400 text-white"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              } block px-4 py-2 rounded-md text-base font-medium`}
              onClick={handleMenuClick}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className={`${
                location.pathname === "/login"
                  ? "bg-indigo-400 text-white"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              } block px-4 py-2 rounded-md text-base font-medium`}
              onClick={handleMenuClick}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
