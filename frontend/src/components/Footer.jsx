import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-5">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-sm">
          {new Date().getFullYear()} made by <i className="fa fa-heart heart text-danger"> Dawood jan</i>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
