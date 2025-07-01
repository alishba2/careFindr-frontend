import React, { useEffect, useState } from "react";
import {
  LogoutOutlined,
  HeartOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { useAuth } from "../hook/auth";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_APP_BASE_URL;
import { Button } from "../button";
const Header = () => {
  const { logout, authData } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");

  };

  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    if (authData?.profileImage) {
      setImageUrl(`${backendUrl}/${authData.profileImage}`);
    } else {
      setImageUrl("");
    }
  }, [authData, backendUrl]);

  const profileMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="relative w-full h-20 flex items-center justify-around px-4 md:px-10 bg-white border-b border-gray-200 z-50">
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

      {/* Profile Dropdown */}
      <div className="hidden md:flex items-center">
        {
          authData ? (
            <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
              <Avatar
                // src={authData?.profileImage || null}
                icon={<UserOutlined />}
                className="cursor-pointer"
                size="large"
              />
            </Dropdown>
          ) : (

            <Button className="bg-primarysolid">
              Get Started
            </Button>

          )
        }

      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white flex flex-col items-center space-y-4 py-4 shadow-md md:hidden z-40">
          <a href="#how-it-works" className="text-black hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
          <a href="#benefits" className="text-black hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
          <a href="#hospitals" className="text-black hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>Hospitals</a>
          <a href="#faq" className="text-black hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>

          {/* Mobile Avatar & Logout */}
          {
            authData ? (
              <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
                <Avatar
                  // src={authData?.profileImage || null}
                  icon={<UserOutlined />}
                  className="cursor-pointer"
                  size="large"
                />
              </Dropdown>
            ) : (

              <Button className="bg-primarysolid">
                Get Started
              </Button>

            )
          }
        </div>
      )}
    </header>
  );
};

export default Header;
