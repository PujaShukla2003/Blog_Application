import React from 'react';
import { FaGithub } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";
import { FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      {/* Main footer links */}
      <footer className="border-t border-gray-300 py-10 bg-blue text-black">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center md:text-start">
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Flutter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">React</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Android</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">IOS</a></li>
            </ul>
          </div>

          <div className="text-center md:text-start">
            <h2 className="text-lg font-semibold mb-4">Design to code</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Figma Plugin</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Templates</a></li>
            </ul>
          </div>

          <div className="text-center md:text-start">
            <h2 className="text-lg font-semibold mb-4">Company</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Career</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="text-center md:text-start">
            <h2 className="text-lg font-semibold mb-4">Comparison</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">DhiWise vs Anima</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">DhiWise vs Appsmith</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">DhiWise vs FlutterFlow</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">DhiWise vs Monday Hero</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">DhiWise vs Retool</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">DhiWise vs Bubble</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">DhiWise vs Figma Dev Mode</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Bottom copyright & social icons */}
      <div className="border-t border-gray-300 py-4 bg-blue text-black">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className='font-semibold text-xl'>
            Cilli<span className='text-blue-500'>Blog</span>
          </div>
          <div className="text-sm  text-black-600">&copy; 2025 DhiWise PVT. LTD All rights reserved</div>
          <div className="flex gap-4 text-black-600 text-lg">
            <a href="https://github.com/PujaShukla2003" className="hover:text-black"><FaGithub /></a>
            <a href="https://www.youtube.com/@pujashukla923" className="hover:text-black"><BsYoutube /></a>
            <a href="https://www.linkedin.com/in/puja-shukla-137049284/" className="hover:text-black"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

