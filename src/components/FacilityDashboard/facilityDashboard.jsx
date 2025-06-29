import React, { useState } from "react";
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

import DashboardHome from "./dashboardHome";
import Services from './services';
import Referrals from "./referrals";
import Feedback from "./feedback";
import { FacilityInformation } from "./facilityInformation";
import Header from "../pages/header";
import { DocumentUpload } from "./documentUpload";
import { useAuth } from "../hook/auth";
import { uploadImage } from "../../services/auth";

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const FacilityDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [profileImage, setProfileImage] = useState("");
  const { fetchAuthData, authData } = useAuth();

  const handleImageUpload = async (file) => {
    try {
      const res = await uploadImage(file, authData._id); // Upload image and get path
      setProfileImage(`${import.meta.env.VITE_APP_BASE_URL}/${res.imagePath}`);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage("");
    // Optionally: Call backend to delete image as well
  };

  const menuItems = [
    { key: "home", icon: <HomeOutlined />, label: "Overview" },
    {
      key: "profile-management",
      icon: <SettingFilled />,
      label: "Profile Management",
      children: [
        { key: "facility-info", icon: <DatabaseOutlined />, label: "Facility Information" },
        { key: "service-capacity", icon: <AreaChartOutlined />, label: "Service & Capacity" },
        { key: "document-upload", icon: <CloudUploadOutlined />, label: "Document Upload" },
      ],
    },
    { key: "referrals", icon: <TeamOutlined />, label: "Referrals" },
    { key: "notifications", icon: <BellOutlined />, label: "Notifications" },
    { key: "support", icon: <MessageOutlined />, label: "Get Support" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "facility-info":
        return <FacilityInformation />;
      case "service-capacity":
        return <Services />;
      case "document-upload":
        return <DocumentUpload />;
      case "referrals":
        return <Referrals />;
      case "notifications":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p>Notifications content goes here...</p>
          </div>
        );
      case "support":
        return <Feedback />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <>
      <Header />
      <Layout style={{ height: "calc(100vh - 64px)" }} className="py-4">
        <Sider
          width={380}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className="bg-white shadow-md mt-6 mx-6 rounded-xl px-4 py-6"
          style={{ height: "100%", overflow: "auto" }}
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
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div
                className="rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
                style={{
                  width: 140,
                  height: 140,
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

                <CameraOutlined
                  style={{
                    position: "absolute",
                    fontSize: 28,
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    padding: 8,
                    borderRadius: "50%",
                  }}
                />
              </div>

              {/* Delete Button */}
              {profileImage && (
                <span
                  onClick={handleDeleteImage}
                  title="Delete"
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    backgroundColor: "#f44336",
                    color: "white",
                    borderRadius: "50%",
                    padding: "4px 6px",
                    cursor: "pointer",
                    fontSize: 12,
                    zIndex: 1,
                  }}
                >
                  ✕
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

            {!collapsed && (
              <h3 className="mt-3 text-center font-semibold text-[20px] text-gray-800">
                {authData?.type || "Facility"}
              </h3>
            )}
          </div>

          {/* Menu */}
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            defaultOpenKeys={["profile-management"]}
            onClick={({ key }) => setActiveTab(key)}
            style={{
              border: "none",
              fontSize: "17px",
              backgroundColor: "transparent",
              color: "#687076",
            }}
            inlineCollapsed={collapsed}
          >
            {menuItems.map((item) =>
              item.children ? (
                <SubMenu
                  key={item.key}
                  title={
                    <span
                      className="flex items-center gap-2"
                      style={{
                        backgroundColor: activeTab.startsWith(item.key) ? "#E7F9FB" : "transparent",
                        color: activeTab.startsWith(item.key) ? "#0C7792" : "#687076",
                        borderRadius: "10px",
                        fontSize: "17px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {!collapsed && (
                        <>
                          {item.icon}
                          {item.label}
                        </>
                      )}
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
                      style={{
                        backgroundColor: activeTab === child.key ? "#E7F9FB" : "transparent",
                        color: activeTab === child.key ? "#0C7792" : "#687076",
                        fontSize: "16px",
                        borderRadius: "8px",
                        marginBottom: "2px",
                      }}
                    >
                      {child.label}
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  style={{
                    backgroundColor: activeTab === item.key ? "#E7F9FB" : "transparent",
                    color: activeTab === item.key ? "#0C7792" : "#687076",
                    borderRadius: "10px",
                    fontSize: "17px",
                    marginBottom: "6px",
                    paddingLeft: "20px",
                    paddingRight: "10px",
                  }}
                >
                  {item.label}
                </Menu.Item>
              )
            )}
          </Menu>
        </Sider>

        <Layout>
          <Content
            className="p-6"
            style={{
              overflowY: "auto",
              height: "100%",
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default FacilityDashboard;
