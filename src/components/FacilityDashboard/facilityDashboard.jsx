// File: src/pages/dashboard/FacilityDashboard.jsx
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
  AreaChartOutlined ,
  SnippetsOutlined ,
  
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

const FacilityDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const menuItems = [
    { key: "home", icon: <HomeOutlined />, label: "Overview" },
    { key: "profile", icon: <  SettingFilled/>, label: " Profile Management" },
    { key: "services", icon: <AreaChartOutlined />, label: " Facility Information" },
    { key: "appointments", icon: <CalendarOutlined />, label: "Service & Capacity" },
    { key: "referrals", icon: <SnippetsOutlined />, label: "Document Upload" },
    { key: "feedback", icon: <TeamOutlined />, label: "Get Support" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "profile":
        return <Profile/>
      case "services":
        return <EditServices />;
      case "equipment":
        return <EquipmentMenu />;
      case "appointments":
        return <Appointments />;
      case "referrals":
        return <Referrals />;
      case "feedback":
        return <Feedback />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <>
      <Navbar type={"Facility"} />


      <Layout className="h-screen ">
        
        <Sider
          width={320}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className="bg-white shadow-md mt-6 mx-6 rounded-xl p-4"
          style={{ height: "640px" }}
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
            onClick={({ key }) => setActiveTab(key)}
            className="text-base"
            style={{ boxShadow: "none", border: "none" }}
          >

            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                className="!h-12 !flex items-center"
                style={{
                  backgroundColor: activeTab === item.key ? "#E7F9FB" : "transparent",
                  color: activeTab === item.key ? "#0C7792" : "#000",
                }}
              >

                {!collapsed && item.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>

        <Layout>
          <Content className="p-6 ">{renderContent()}</Content>
        </Layout>
      </Layout>
    </>
  );
};

export default FacilityDashboard;
