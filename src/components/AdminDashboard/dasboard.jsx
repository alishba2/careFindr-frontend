import React, { useState } from "react";
import {
    HomeOutlined,
    AppstoreOutlined,
    FileSearchOutlined,
    TeamOutlined,
    BellOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MedicineBoxOutlined,
    ExperimentOutlined,
    PlusCircleOutlined,
    CarOutlined,
    BankOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./topBar";
import AllFacilities from "./allFacilities";
import AdminList from "./admin";
import FacilityDetail from "./facility-detail";

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const statCards = [
    {
        label: "Total Facilities",
        count: 1202,
        icon: "📈",
        delta: "+2 This week",
        bg: "bg-[#e4fbe6]",
    },
    {
        label: "Labs Registered",
        count: 308,
        icon: "🧪",
        delta: "+2 This week",
        bg: "bg-[#d8faff]",
    },
    {
        label: "Pharmacies Registered",
        count: 420,
        icon: "💊",
        delta: "+2 This week",
        bg: "bg-[#e1ecff]",
    },
    {
        label: "Ambulance Services",
        count: 120,
        icon: "🚑",
        delta: "+2 This week",
        bg: "bg-[#e6deff]",
    },
    {
        label: "Pending Verifications",
        count: 83,
        icon: "🕓",
        delta: "+2 This week",
        bg: "bg-[#ffe9d7]",
    },
    {
        label: "Incomplete Registration",
        count: 210,
        icon: "📂",
        delta: "+2 This week",
        bg: "bg-[#ffe3f3]",
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
            ["all", "Hospital", "Laboratory", "Clinic", "Pharmacy", "Ambulance","Insurance"].includes(key)
        ) {
            navigate("/admin-dashboard/facilities?type=" + key);
        }
        if (key === "4") navigate("/admin-dashboard/admins");
    };

    return (
        <Layout className="min-h-screen">
            <Navbar />
            <Layout>
                <Sider
                    width={320}
                    className="bg-white shadow-md mt-6 mx-6 rounded-xl p-4"
                    // style={{ height: "800px" }}
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

                        <SubMenu key="2" icon={<AppstoreOutlined />} title={!collapsed && "Facilities"}>
                            <Menu.Item key="all" icon={<FileSearchOutlined />}>All Facilities</Menu.Item>
                            <Menu.Item key="Hospital" icon={<BankOutlined />}>Hospital</Menu.Item>
                            <Menu.Item key="Laboratory" icon={<ExperimentOutlined />}>Laboratory</Menu.Item>
                            <Menu.Item key="Clinic" icon={<PlusCircleOutlined />}>Specialist Clinic</Menu.Item>
                            <Menu.Item key="Pharmacy" icon={<MedicineBoxOutlined />}>Pharmacy</Menu.Item>
                            <Menu.Item key="Ambulance" icon={<CarOutlined />}>Ambulance</Menu.Item>
                            <Menu.Item key="Insurance" icon={<FileSearchOutlined />}>Insurance</Menu.Item>
                        </SubMenu>

                        <Menu.Item key="4" icon={<TeamOutlined />}>
                            {!collapsed && "Admins & Roles"}
                        </Menu.Item>
                        <Menu.Item key="5" icon={<BellOutlined />}>
                            {!collapsed && "Notifications"}
                        </Menu.Item>
                        <Menu.Item key="6" icon={<SettingOutlined />}>
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
                                        <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
                                        {/* Add your stat cards or summary here */}
                                        <p className="text-gray-500">Welcome back, admin!</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-8 mb-12">
                                            {statCards.map((card, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white rounded-xl shadow px-8 py-10 flex items-center justify-between w-full"
                                                >
                                                    <div>
                                                        <h3 className="font-inter font-medium text-lg leading-28px tracking-[0.5%] mb-3">
                                                            {card.label}
                                                        </h3>
                                                        <div className="text-2xl font-bold mb-3">{card.count}</div>
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
                                            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                                            <p className="text-gray-500">No recent activity</p>
                                        </div>
                                    </div>
                                }
                            />
                            <Route path="/facilities" element={<AllFacilities />} />
                            <Route path="/facilities/:id" element={<FacilityDetail />} />
                            <Route path="/admins" element={<AdminList />} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;
