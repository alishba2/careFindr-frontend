import React, { useEffect, useState } from "react";
import {
  HomeOutlined,
  SettingFilled,
  AreaChartOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  BellOutlined,
  MessageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DatabaseOutlined,
  CameraOutlined
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "../pages/header";
import { useAuth } from "../hook/auth";
import { uploadImage } from "../../services/auth";

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const FacilityDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { fetchAuthData, authData } = useAuth();
  const [profileImage, setProfileImage] = useState("");
  const location = useLocation();

  // Set collapsed state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchAuthData();
  }, []);

  const handleImageUpload = async (file) => {
    try {
      const res = await uploadImage(file, authData._id);
      setProfileImage(`${import.meta.env.VITE_APP_BASE_URL}/${res.imagePath}`);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage("");
    // Optionally: Call backend to delete image
  };

  const menuItems = [
    { key: "home", icon: <HomeOutlined />, label: "Overview", path: "home" },
    {
      key: "profile-management",
      icon: <SettingFilled />,
      label: "Profile Management",
      children: [
        { key: "facility-info", icon: <DatabaseOutlined />, label: "Facility Information", path: "facility-info" },
        { key: "service-capacity", icon: <AreaChartOutlined />, label: "Service & Capacity", path: "service-capacity" },
        { key: "document-upload", icon: <CloudUploadOutlined />, label: "Document Upload", path: "document-upload" },
      ],
    },
    { key: "referrals", icon: <TeamOutlined />, label: "Referrals", path: "referrals" },
    { key: "notifications", icon: <BellOutlined />, label: "Notifications", path: "notifications" },
    { key: "support", icon: <MessageOutlined />, label: "Get Support", path: "support" },
  ];

  return (
    <>
      <Header />
      <Layout className="py-4 min-h-[calc(100vh-64px)]">
        <Sider
          width={380}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className="bg-white shadow-md mt-6 mx-2 sm:mx-4 md:mx-6 rounded-xl px-4 py-6"
          // style={{ height: "100%", overflow: "auto" }}
          breakpoint="md"
          collapsedWidth={80}
          onBreakpoint={(broken) => setCollapsed(broken)}
        >
          {/* Collapse Button */}
          <div className="flex justify-end mb-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
          </div>

          {/* Profile Image */}
          {!collapsed && (
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
              <div
                className="rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
                style={{
                  width: 150,
                  height: 150,
                  border: "4px solid #ccc",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("profile-image-input").click()}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>
              <CameraOutlined
                className="absolute bottom-0 right-3 bg-black bg-opacity-40 text-white p-2 rounded-full"
                style={{ fontSize: 24 }}
              />

                {/* Delete Button */}
                {profileImage && (
                  <span
                    onClick={handleDeleteImage}
                    title="Delete"
                    className="absolute top-0 right-0 text-black rounded-full p-1 cursor-pointer text-xs"
                    style={{ zIndex: 1 }}
                  >
                    X
                  </span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                id="profile-image-input"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />

              <h3 className="mt-3 text-center font-semibold text-[20px] text-gray-800">
                {authData?.name || "Facility"}
              </h3>
            </div>
          )}

          {/* Menu */}
          <Menu
            mode="inline"
            defaultOpenKeys={["profile-management"]}
            className="bg-transparent text-[#687076] text-[17px]"
            inlineCollapsed={collapsed}
            style={{ border: "none" }}
          >
            {menuItems.map((item) =>
              item.children ? (
                <SubMenu
                  key={item.key}
                  title={
                    <span
                      className="flex items-center gap-3 px-3 py-2"
                      style={{
                        // backgroundColor: item.children.some((child) => location.pathname === `/facility-dashboard/${child.path}`) ? "#E7F9FB" : "transparent",
                        color: item.children.some((child) => location.pathname === `/facility-dashboard/${child.path}`) ? "#0C7792" : "#687076",
                        borderRadius: "10px",
                        position:'relative',
                        left:'-12px'
                        
                      }}
                    >
                      {item.icon}
                      {!collapsed && item.label}
                    </span>
                  }
                  style={{
                    marginBottom: "6px",
                    borderRadius: "10px",
                  }}
                >
                  {item.children.map((child) => (
                    <Menu.Item
                      key={child.key}
                      icon={child.icon}
                      className="flex items-center gap-3 px-6"
                      style={{
                        backgroundColor: location.pathname === `/facility-dashboard/${child.path}` ? "#E7F9FB" : "transparent",
                        color: location.pathname === `/facility-dashboard/${child.path}` ? "#0C7792" : "#687076",
                        borderRadius: "8px",
                        marginBottom: "2px",
                        fontSize: "16px",
                      }}
                    >
                      <NavLink to={child.path} className="flex-1">
                        {child.label}
                      </NavLink>
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  className="flex items-center gap-3 px-3 py-2"
                  style={{
                    backgroundColor: location.pathname === `/facility-dashboard/${item.path}` ? "#E7F9FB" : "transparent",
                    color: location.pathname === `/facility-dashboard/${item.path}` ? "#0C7792" : "#687076",
                    borderRadius: "10px",
                    marginBottom: "6px",
                    fontSize: "17px",
                  }}
                >
                  <NavLink to={item.path} className="flex-1">
                    {item.label}
                  </NavLink>
                </Menu.Item>
              )
            )}
          </Menu>
        </Sider>

        <Layout>
          <Content
            className="p-4 sm:p-6 md:p-8"
            style={{
              overflowY: "auto",
              height: "100%",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default FacilityDashboard;