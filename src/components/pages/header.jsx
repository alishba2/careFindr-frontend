import React from "react";

const Header = () => {
  return (
    <header className="w-full h-20 flex items-center justify-between px-20 bg-bgdefault-bg">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-[#0EA5E9]">CareFindr</span>
      </div>
      <nav className="flex-1 flex items-center justify-center space-x-6 md:flex text-sm font-medium text-gray-700">
        <a href="#how-it-works" className="hover:text-blue-500">How It Works</a>
        <a href="#benefits" className="hover:text-blue-500">Benefits</a>
        <a href="#hospitals" className="hover:text-blue-500">Hospitals</a>
        <a href="#blog" className="hover:text-blue-500">Blog</a>
        <a href="#faq" className="hover:text-blue-500">FAQ</a>
      </nav>
    </header>
  );
};

export default Header;

