import React from "react";
import vector from "../../assets/Vector.png";

const Header = () => {
  return (
    <header className="relative w-full h-20 flex items-center justify-between px-20 bg-bgdefault-bg">
      {/* Logo */}
      <div className="flex items-center space-x-2 z-10">
        <img src={vector} alt="vector" className="w-10 h-10 mr-1" />
        <span className="text-[36px] font-bold font-['Nunito Sans'] leading-[100%] tracking-[-1%] align-middle text-[#05A2C2]">
          CareFindr
        </span>
      </div>

      {/* Centered Nav */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-10 text-base font-bold text-black">
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
