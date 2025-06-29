import React, { useState, useEffect } from "react";
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
} from "@ant-design/icons";
import { Layout, Menu, Button, Avatar } from "antd";

import DashboardHome from "./dashboardHome";
import Services from './services';
import Referrals from "./referrals";
import Feedback from "./feedback";
import { FacilityInformation } from "./facilityInformation";
import Header from "../pages/header";
import { DocumentUpload } from "./documentUpload";
import { useAuth } from "../hook/auth";


const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const FacilityDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const { fetchAuthData } = useAuth();



  const menuItems = [
    { key: "home", icon: <HomeOutlined />, label: "Overview" },
    {
      key: "profile-management",
      icon: <SettingFilled />,
      label: "Profile Management",
      children: [
        {
          key: "facility-info",
          icon: <DatabaseOutlined />,
          label: "Facility Information",
        },
        {
          key: "service-capacity",
          icon: <AreaChartOutlined />,
          label: "Service & Capacity",
        },
        {
          key: "document-upload",
          icon: <CloudUploadOutlined />,
          label: "Document Upload",
        },
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
          className="bg-white shadow-md mt-6 mx-6  rounded-xl px-4 py-6 "
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

          {/* Avatar & Name */}
          <div className="flex flex-col items-center mb-6">
            <Avatar size={100} src="https://i.pravatar.cc/150?img=3" />
            {!collapsed && (
              <h3 className="mt-3 text-center font-semibold text-[18px] text-gray-800">
                Mercy Life
              </h3>
            )}
          </div>
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
                  // icon={item.icon}
                  title={
                    <span
                      className="flex items-center gap-2"
                      style={{
                        backgroundColor: activeTab.startsWith(item.key) ? "#E7F9FB" : "transparent",
                        color: activeTab.startsWith(item.key) ? "#0C7792" : "#687076",
                        borderRadius: "10px",
                        fontSize: "17px",
                        // padding: "0px 8px",
                     
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
                        // paddingLeft: "48px",
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

