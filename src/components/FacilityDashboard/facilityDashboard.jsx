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
  CameraOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../pages/navbar";
import { uploadImage } from "../../services/auth";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hook/auth";
const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const backendUrl = import.meta.env.VITE_APP_BASE_URL;

const FacilityDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { fetchAuthData, authData, isAmbulance } = useAuth();
  const [profileImage, setProfileImage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("home");
  const { facilityType } = authData || {};
  useEffect(() => {
    if (authData?.profileImage) {
      setProfileImage(`${import.meta.env.VITE_APP_BASE_URL}/${authData.profileImage}`);
    }
  }, [authData])

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

  // Update selected key based on location
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "service-capacity" && location.state?.type === "ambulance") {
      setSelectedKey("ambulance");
    } else {
      const matchedItem = menuItems
        .flatMap((item) => (item.children ? item.children : item))
        .find((item) => item.path === path);
      setSelectedKey(matchedItem?.key || "home");
    }
  }, [location]);

  const handleImageUpload = async (file) => {
    try {
      const res = await uploadImage(file, authData._id);
      setProfileImage(`${import.meta.env.VITE_APP_BASE_URL}/${res.profileImage}`);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleDeleteImage = async () => {
    try {
      // Assume deleteImage is a function that deletes the image from the backend
      await uploadImage(null, authData._id);
      setProfileImage("");
    } catch (error) {
      console.error("Delete failed", error);
    }
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
        {
          key: "ambulance",
          icon: <CarOutlined />,
          label: "Ambulance",
          hidden: !isAmbulance,
          customNavigate: () => {
            setSelectedKey("ambulance");
            navigate("service-capacity", { state: { type: "ambulance" } });
          },
        },
      ],
    },
    { key: "referrals", icon: <TeamOutlined />, label: "Referrals", path: "referrals" },
    { key: "notifications", icon: <BellOutlined />, label: "Notifications", path: "notifications" },
    { key: "support", icon: <MessageOutlined />, label: "Get Support", path: "support" },
  ];

  return (
    <>
      <Navbar />
      <Layout>
        <Sider
          width={collapsed ? 60 : Math.min(350, window.innerWidth - 40)}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className="bg-white shadow-md mt-6  mx-2 rounded-xl px-4 pt-6"
          breakpoint="md"
          collapsedWidth={60}
          onBreakpoint={(broken) => setCollapsed(broken)}
          style={{
            height: "calc(100vh - 6rem)",
            maxWidth: "calc(100vw - 20px)",
            overflow: "scroll",
            scrollbarWidth: "none",

          }}
        >
          <div className="flex justify-end mb-5 ">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg px-9"
            />
          </div>

          {!collapsed && (
            <div className="flex flex-col items-center mb-6 px-2">
              <div className="relative">
                <div
                  className="rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
                  style={{
                    width: 120, // Reduced from 150 for better mobile fit
                    height: 120, // Reduced from 150 for better mobile fit
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
                  style={{ fontSize: 20 }} // Reduced from 24
                />
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
              <h3 className="mt-3 text-center font-semibold text-[18px] sm:text-[20px] text-gray-800 px-2">
                {authData?.name || "Facility"}
              </h3>
            </div>
          )}

          <Menu
            mode="inline"
            defaultOpenKeys={["profile-management"]}
            selectedKeys={[selectedKey]}
            className="bg-transparent text-[#687076] text-[15px] sm:text-[17px]"
            inlineCollapsed={collapsed}
            style={{ border: "none" }}
          >
            {menuItems.map((item) =>
              item.children ? (
                <SubMenu
                  key={item.key}
                  title={
                    <span
                      className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2"
                      style={{
                        color: item.children.some((child) => child.key === selectedKey) ? "#359DF4" : "#687076",
                        borderRadius: "10px",
                        position: "relative",
                        left: "-8px",
                      }}
                    >
                      {item.icon}
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </span>
                  }
                  style={{
                    marginBottom: "6px",
                    borderRadius: "10px",
                  }}
                >
                  {item.children
                    .filter((child) => !child.hidden)
                    .map((child) => (
                      <Menu.Item
                        key={child.key}
                        icon={child.icon}
                        className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6"
                        style={{
                          backgroundColor: child.key === selectedKey ? "#c1e3ff" : "transparent",
                          color: child.key === selectedKey ? "#359DF4" : "#687076",
                          borderRadius: "8px",
                          marginBottom: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span
                          className="flex-1 truncate"
                          onClick={() => {
                            setSelectedKey(child.key);
                            if (child.customNavigate) {
                              child.customNavigate();
                            } else {
                              navigate(child.path);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {child.label}
                        </span>
                      </Menu.Item>
                    ))}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2"
                  style={{
                    backgroundColor: item.key === selectedKey ? "#c1e3ff" : "transparent",
                    color: item.key === selectedKey ? "#359DF4" : "#687076",
                    borderRadius: "10px",
                    marginBottom: "6px",
                    fontSize: "15px",
                  }}
                >
                  <NavLink
                    to={item.path}
                    className="flex-1 truncate"
                    onClick={() => setSelectedKey(item.key)}
                  >
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
              height: "100%",
              overflowY: "scroll",
              backgroundColor: "#f5f5f5",
              maxHeight: "93vh",
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