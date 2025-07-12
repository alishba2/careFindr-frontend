import React, { useState } from "react";
import {
  HomeOutlined,
  FileSearchOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  CarOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./topBar";
import AllFacilities from "./allFacilities";
import AdminList from "./admin";
import FacilityDetail from "./facility-detail";

import falities from "../../components/asstes/falities.png";
import doucment from "../../components/asstes/doucment.png";
import users from "../../components/asstes/users.png";
import referrels from "../../components/asstes/referrels.png";
import message from "../../components/asstes/message.png";
import notifications from "../../components/asstes/notifications.png";
import blog from "../../components/asstes/blog.png";
import Analytics from "../../components/asstes/Analytics.png";
import Vector from "../../components/asstes/Vector.png";

import file from "../../components/asstes/file.png";
import lab from "../../components/asstes/lab.png";
import car from "../../components/asstes/car.png";
import register from "../../components/asstes/register.png";
import color from "../../components/asstes/color.png";
import time from "../../components/asstes/time.png";
import Users from "./users";
import { User } from "lucide-react";
import Referrals from "./referrals";
const { Sider, Content } = Layout;
const { SubMenu } = Menu;

import AdminChatPage from "./converstaions";
const statCards = [
  {
    label: "Total Facilities",
    count: "1,202",
    icon: <img src={color} alt="color" />,
    delta: "+2 This week",
    bg: "bg-[#E5FFD1]",
  },
  {
    label: "Labs Registered",
    count: 308,
    icon: <img src={file} alt="file " />,
    delta: "+2 This week",
    bg: "bg-[#FFD1E5]",
  },
  {
    label: "Pharmacies Registered",
    count: 420,
    icon: <img src={file} alt="file " />,
    delta: "+2 This week",
    bg: "bg-[#FFD1E5]",
  },
  {
    label: "Ambulance Services",
    count: 120,
    icon: <img src={car} alt="car" />,
    delta: "+2 This week",
    bg: "bg-[#E2D1FF]",
  },
  {
    label: "Pending Verifications",
    count: 83,
    icon: <img src={car} alt="car" />,
    delta: "+2 This week",
    bg: "bg-[#E2D1FF]",
  },
  {
    label: "Incomplete Registration",
    count: 210,
    icon: <img src={lab} alt="lab" />,
    delta: "+2 This week",
    bg: "bg-[#D1FFFB]",
  },
  {
    label: "Incomplete Registration",
    count: 210,
    icon: <img src={register} alt="register" />,
    delta: "+2 This week",
    bg: "bg-[#D1E5FF]",
  },
  {
    label: "Incomplete Registration",
    count: 210,
    icon: <img src={car} alt="car" />,
    delta: "+2 This week",
    bg: "bg-[#E2D1FF]",
  },
  {
    label: "Incomplete Registration",
    count: 210,
    icon: <img src={time} alt="time" />,
    delta: "+2 This week",
    bg: "bg-[#FFE5D1]",
  },
  {
    label: "Incomplete Registration",
    count: 210,
    icon: <img src={file} alt="file " />,
    delta: "+2 This week",
    bg: "bg-[#FFD1E5]",
  },
];

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState("1");

  const handleMenuClick = ({ key }) => {
    setActiveMenu(key);
    if (key === "1") navigate("/admin-dashboard");
    if (
      [
        "all",
        "Hospital",
        "Laboratory",
        "Clinic",
        "Pharmacy",
        "Ambulance",
        "Insurance",
        "Other",
      ].includes(key)
    ) {
      navigate("/admin-dashboard/facilities?type=" + key);
    }
    if (key === "4") navigate("/admin-dashboard/admins");
    if (key === "5") navigate("/admin-dashboard/users");
    if (key === "6") navigate("/admin-dashboard/referrals");
    if (key === "8") navigate("/admin-dashboard/conversations");
  };

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout>
        <Sider
          width={320}
          className="bg-white shadow-md mt-6 mx-6 rounded-xl p-4"
          collapsible
          collapsed={collapsed}
          trigger={null}
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
            selectedKeys={[activeMenu]}
            className="text-base"
            style={{ boxShadow: "none", border: "none" }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              {!collapsed && "Overview"}
            </Menu.Item>
            <SubMenu
              key="2"
              icon={<img src={falities} alt="falities" />}
              title={!collapsed && "All Facilities"}
            >
              <Menu.Item key="all" icon={<FileSearchOutlined />}>
                All
              </Menu.Item>
              <Menu.Item key="Hospital" icon={<BankOutlined />}>
                Hospital
              </Menu.Item>
              <Menu.Item key="Laboratory" icon={<ExperimentOutlined />}>
                Laboratory
              </Menu.Item>
              <Menu.Item key="Pharmacy" icon={<MedicineBoxOutlined />}>
                Pharmacy
              </Menu.Item>
              <Menu.Item key="Ambulance" icon={<CarOutlined />}>
                Ambulance
              </Menu.Item>
              <Menu.Item key="Insurance" icon={<FileSearchOutlined />}>
                Insurance
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="4" icon={<img src={doucment} alt="doucment" />}>
              {!collapsed && "Document Review"}
            </Menu.Item>
            <Menu.Item key="5" icon={<img src={users} alt="users" />}>
              {!collapsed && "Users"}
            </Menu.Item>
            <Menu.Item key="6" icon={<img src={referrels} alt="referrels" />}>
              {!collapsed && "Referrals"}
            </Menu.Item>
            <Menu.Item key="8" icon={<img src={message} alt="message" />}>
              {!collapsed && "Conversations"}
            </Menu.Item>
            <Menu.Item
              key="9"
              icon={<img src={notifications} alt="notifications" />}
            >
              {!collapsed && "Notifications"}
            </Menu.Item>
            <Menu.Item key="10" icon={<img src={blog} alt="blog" />}>
              {!collapsed && "Blog"}
            </Menu.Item>
            <Menu.Item key="11" icon={<img src={Analytics} alt="Analytics" />}>
              {!collapsed && "Analytics"}
            </Menu.Item>
            <Menu.Item key="4" icon={<img src={Vector} alt="Vector" />}>
              {!collapsed && "Admins & Roles"}
            </Menu.Item>
            <Menu.Item key="13" icon={<SettingOutlined />}>
              {!collapsed && "Settings"}
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Content className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <h2 className="text-4xl font-bold mb-2">
                      Dashboard Overview
                    </h2>
                    <p className="text-gray-500 text-xl mb-8">
                      Welcome back! Here's what's happening with your facility
                      today.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-5 mb-6">
                      {statCards.map((card, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl shadow px-8 py-10 flex items-center justify-between w-full"
                        >
                          <div>
                            <h3 className="font-inter font-medium text-lg leading-28px tracking-[0.5%] mb-3">
                              {card.label}
                            </h3>
                            <div className="text-2xl font-bold mb-3">
                              {card.count}
                            </div>
                            <div className="font-inter font-normal text-base leading-6 tracking-[0.5%] align-middle text-[#259678]">
                              {card.delta}
                            </div>
                          </div>
                          <div
                            className={`w-20 h-20 flex items-center justify-center rounded-full text-2xl ${card.bg}`}
                          >
                            {card.icon}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                      <h3 className="text-2xl font-bold mb-2">
                        Recent Activity
                      </h3>
                      <p className="text-gray-500 text-xl text-center">
                        No recent activity
                      </p>
                    </div>
                  </div>
                }
              />
              <Route path="/facilities" element={<AllFacilities />} />
              <Route path="/facilities/:id" element={<FacilityDetail />} />
              <Route path="/admins" element={<AdminList />} />
              <Route path="/users" element={<Users />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/conversations" element={<AdminChatPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
