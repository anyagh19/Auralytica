import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../src/constants";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
console.log("User logged in:", isLoggedIn);

const handleLogout = async () => {
  localStorage.clear();
  console.log("User logged out");
}

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-green-600">
          Aura<span className="text-gray-800">lyst</span>
        </div>
        

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium items-center">
          <Link to={"/"} className="hover:text-blue-600 transition">Home</Link>
          <Link to={"/services"} className="hover:text-blue-600 transition">Services</Link>
          <Link to={"/about"} className="hover:text-blue-600 transition">About</Link>
          <Link to={"/contact"} className="hover:text-blue-600 transition">Contact</Link>
          {isLoggedIn ? <Link to={"/"} className="bg-red-400 text-white px-4 py-2 rounded-lg hover:text-red-600 transition" onClick={handleLogout}>Log Out</Link> : <Link to={"/login"} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Login</Link>}
          
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          <a href="#home" className="block text-gray-700 hover:text-green-600">Home</a>
          <a href="#about" className="block text-gray-700 hover:text-green-600">About</a>
          <a href="#services" className="block text-gray-700 hover:text-green-600">Services</a>
          <a href="#products" className="block text-gray-700 hover:text-green-600">Products</a>
          <a href="#contact" className="block text-gray-700 hover:text-green-600">Contact</a>
        </nav>
      )}
    </header>
  );
};

export default Header;
