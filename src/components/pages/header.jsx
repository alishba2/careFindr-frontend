import React, { useState } from "react";
import { LogoutOutlined, HeartOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useAuth } from "../hook/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="relative w-full h-20 flex items-center justify-between px-4 md:px-10 bg-white border-b border-gray-200 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <HeartOutlined className="text-[#05A2C2] text-2xl" />
        <span className="text-[24px] font-bold font-['Nunito Sans'] text-[#05A2C2]">
          CareFindr
        </span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-10 text-sm font-normal text-black">
        <a href="#how-it-works" className="hover:text-blue-500">How It Works</a>
        <a href="#benefits" className="hover:text-blue-500">Benefits</a>
        <a href="#hospitals" className="hover:text-blue-500">Hospitals</a>
        <a href="#faq" className="hover:text-blue-500">FAQ</a>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <CloseOutlined className="text-2xl text-[#05A2C2]" />
          ) : (
            <MenuOutlined className="text-2xl text-[#05A2C2]" />
          )}
        </button>
      </div>

      {/* Logout Button */}
      <div className="hidden md:flex items-center">
        <button
          className="bg-[#05A2C2] hover:bg-[#147bcc] text-white rounded-md px-4 py-2 flex items-center justify-center"
          onClick={handleLogout}
        >
          <LogoutOutlined className="text-lg" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white flex flex-col items-center space-y-4 py-4 shadow-md md:hidden z-40">
          <a href="#how-it-works" className="text-black hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
          <a href="#benefits" className="text-black hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
          <a href="#hospitals" className="text-black hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>Hospitals</a>
          <a href="#faq" className="text-black hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
          <button
            className="bg-[#05A2C2] hover:bg-[#147bcc] text-white rounded-md px-4 py-2 flex items-center justify-center"
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
          >
            <LogoutOutlined className="text-lg" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
