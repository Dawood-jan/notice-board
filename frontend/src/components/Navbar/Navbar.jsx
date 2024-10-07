import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

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
    <header className="bg-gradient-to-br from-gray-900 to-emerald-900 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl py-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white">
              <img src="/Notice Board.png" alt="Notice Board Icon" className="h-12 w-12" />
            </Link>
          </div>
          <div className="hidden sm:block sm:ml-6 flex-1">
            <div className="flex justify-end space-x-4">
              {/* <Link
                to="/"
                className={`${
                  location.pathname === '/'
                    ? 'bg-teal-600 text-white'
                    : 'text-white hover:bg-teal-500 hover:text-white'
                } px-4 py-2 rounded-md text-base font-medium`}
              >
                Home
              </Link> */}
              <Link
                to="/register"
                className={`${
                  location.pathname === '/register'
                    ? 'bg-teal-600 text-white'
                    : 'text-white hover:bg-teal-500 hover:text-white'
                } px-4 py-2 rounded-md text-base font-medium`}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className={`${
                  location.pathname === '/login'
                    ? 'bg-teal-600 text-white'
                    : 'text-white hover:bg-teal-500 hover:text-white'
                } px-4 py-2 rounded-md text-base font-medium`}
              >
                Login
              </Link>
            </div>
          </div>
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
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* <Link
              to="/"
              className={`${
                location.pathname === '/'
                  ? 'bg-teal-600 text-white'
                  : 'text-white hover:bg-teal-500 hover:text-white'
              } block px-4 py-2 rounded-md text-base font-medium`}
              onClick={handleMenuClick}
            >
              Home
            </Link> */}
            <Link
              to="/register"
              className={`${
                location.pathname === '/register'
                  ? 'bg-teal-600 text-white'
                  : 'text-white hover:bg-teal-500 hover:text-white'
              } block px-4 py-2 rounded-md text-base font-medium`}
              onClick={handleMenuClick}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className={`${
                location.pathname === '/login'
                  ? 'bg-teal-600 text-white'
                  : 'text-white hover:bg-teal-500 hover:text-white'
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
