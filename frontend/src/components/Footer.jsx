import React from "react";
import { Facebook, FacebookIcon, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-700 py-6">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left column: copyright text */}
      <div className="text-sm flex flex-col items-center justify-center md:justify-start">
        <h1 className="text-white text-xl font-bold">Quick Links</h1>
        <ul className="mt-4 space-y-2">
        <li>
            <Link
              to="/"
              className="text-gray-400 text-lg hover:text-green-500 transition duration-200"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/all-notices"
              className="text-gray-400 text-lg hover:text-green-800 transition duration-200"
            >
              All Notices
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-gray-400 text-lg hover:text-green-500 transition duration-200"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contact-us"
              className="text-gray-400 text-lg hover:text-green-500 transition duration-200"
            >
              Contact Us
            </Link>
          </li>
          
        </ul>
      </div>

      {/* Right column: social media icons */}
      <div className="flex flex-col flex-start justify-center md:justify-end space-y-4">
        <h1 className="text-white text-xl font-bold">Contact Us</h1>

        {/* Phone Icon with Number inside a bordered container */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center p-2 border border-green-500 rounded-full hover:border-green-600 transition duration-200">
            <Phone
              className="text-white hover:text-green-500 transition duration-200"
              size={24}
            />
          </div>
          <span className="text-gray-400">(091) 6512541</span>
        </div>

        {/* Location Icon with Address */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center p-2 border border-green-500 rounded-full hover:border-green-600 transition duration-200">
            <MapPin
              className="text-white hover:text-green-500 transition duration-200"
              size={24}
            />
          </div>
          <span className="text-gray-400">
            4PVP+9QP, Chārsadda, Charsadda, Khyber Pakhtunkhwa
          </span>
        </div>

        {/* Facebook Icon */}

        <div className="flex items-center space-x-3">
          <a
            href="https://web.facebook.com/p/Govt-Postgraduate-College-Charsadda-100063968053397/?_rdc=1&_rdr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <div className="flex items-center justify-center p-2 border border-green-500 rounded-full hover:border-green-600 transition duration-200">
              <FacebookIcon
                className="text-white hover:text-green-500 transition duration-200"
                size={24}
              />
            </div>
          </a>
          <span className="text-gray-400">Follow us on</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
