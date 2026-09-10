import React from 'react';
import AuthPanel from './AuthPanel';

const Navbar = ({ user, onAuthenticated, onLogout }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-between px-8 py-4">
    <div className="flex items-center gap-4">
      <div className="text-white text-2xl font-bold">SkillConnect</div>
      <input
  type="text"
  placeholder="Search..."
  className="bg-white text-black px-4 py-1.5 text-base w-96 rounded-sm focus:outline-none shadow-sm transition-all duration-300"
/>


    </div>
    <div className="flex items-center gap-6 text-white">
      <a href="#home" className="hover:text-yellow-400">Home</a>
      <a href="#about" className="hover:text-yellow-400">About Us</a>
      <a href="#services" className="hover:text-yellow-400">Services</a>
      <a href="#hire" className="hover:text-yellow-400">Hire</a>
      <a href="#info" className="hover:text-yellow-400">Reviews</a>
      <a href="#contact" className="hover:text-yellow-400">Contact</a>
      <AuthPanel user={user} onAuthenticated={onAuthenticated} onLogout={onLogout} />
    </div>
  </nav>
  
  );
};

export default Navbar;
