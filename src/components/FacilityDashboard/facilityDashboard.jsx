import React, { useState } from "react";
import {
  HomeOutlined,
  ToolOutlined,
  SettingFilled,
  AppstoreAddOutlined,
  CalendarOutlined,
  TeamOutlined,
  MessageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AreaChartOutlined,
  SnippetsOutlined,
  BellOutlined,
  UserOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";



import { Layout, Menu, Button } from "antd";
import Navbar from "../AdminDashboard/topBar";
import DashboardHome from "./dashboardHome";
import EditServices from "./editService";
import EquipmentMenu from "./equipmentMenu";
import Appointments from "./appointment";
import Referrals from "./referrals";
import Feedback from "./feedback";
import Profile from "./profile";

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const FacilityDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

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
      ]
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
        return <EditServices />; // Facility Information component
      case "service-capacity":
        return <Appointments />; // Service & Capacity component
      case "document-upload":
        return <Profile />; // Document Upload component
      case "referrals":
        return <Referrals />;
      case "notifications":
        return <div className="p-6"><h2 className="text-2xl font-bold">Notifications</h2><p>Notifications content goes here...</p></div>;
      case "support":
        return <Feedback />;
      default:
        return <DashboardHome />;
    }
  };

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <SubMenu
            key={item.key}
            icon={item.icon}
            title={item.label}
            style={{
              backgroundColor: "transparent", 
              color: "#000",
              fontSize: "16px",
              marginBottom: "2px",
            }}
          >
            {item.children.map((child) => (
              <Menu.Item
                key={child.key}
                icon={child.icon}
                style={{
                  backgroundColor: activeTab === child.key ? "#E7F9FB" : "transparent",
                  color: activeTab === child.key ? "#0C7792" : "#000",
                  fontSize: "16px",
                  paddingLeft: "48px", // Proper indentation for submenu items
                  margin: "0",
                  borderRadius: "8px",
                  marginBottom: "2px",
                  
                }}
              >
                {child.label}
              </Menu.Item>
            ))}
          </SubMenu>
        );
      }

      return (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          style={{
            backgroundColor: activeTab === item.key ? "#E7F9FB" : "transparent",
            color: activeTab === item.key ? "#0C7792" : "#000",
            borderRadius: "8px",
            margin: "0 0 2px 0",
          }}
        >
          {!collapsed && item.label}
        </Menu.Item>
      );
    });
  };

  return (
    <>
      <Navbar type={"Facility"} />

      <Layout className="h-screen">
        <Sider
          width={320}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className="bg-white shadow-md mt-6 mx-6 rounded-xl p-4"
          style={{ height: "770px" }}
        >
          <div className="flex justify-end mb-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            defaultOpenKeys={["profile-management"]}
            onClick={({ key }) => setActiveTab(key)}
            style={{ 
              boxShadow: "none", 
              border: "none",
              fontSize: "16px"
            }}
            inlineCollapsed={collapsed}
          >
            {renderMenuItems(menuItems)}
          </Menu>
        </Sider>

        <Layout>
          <Content className="p-6">{renderContent()}</Content>
        </Layout>
      </Layout>
    </>
  );
};

export default FacilityDashboard;