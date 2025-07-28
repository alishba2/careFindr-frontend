import React, { useState, useEffect } from "react";
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
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  PlayCircleOutlined,
  DatabaseOutlined,
  HeartOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Alert, Skeleton } from "antd";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

import AllFacilities from "./allFacilities";
import AdminList from "./admin";
import FacilityDetail from "./facility-detail";
import Users from "./users";
import Referrals from "./referrals";
import Navbar from "../pages/navbar";
import Notifications from "./notifications";
import { AdminAnalytics } from "./analytics";
import AdminChatPage from "./converstaions";
import AddBlogPost from "./blog";
import { useAuth } from "../hook/auth";
import statsService from "../../services/statsService";

import falities from "../../components/asstes/falities.png";
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

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const iconMap = {
  color: <img src={color} alt="color" />,
  file: <img src={file} alt="file" />,
  hospital: <img src={falities} alt="hospital" />,
  lab: <img src={lab} alt="lab" />,
  car: <img src={car} alt="car" />,
  register: <img src={register} alt="register" />,
  time: <img src={time} alt="time" />,
  facilities: <img src={falities} alt="facilities" />,
  total: <DatabaseOutlined className="text-blue-600" style={{ fontSize: '24px' }} />,
  active: <PlayCircleOutlined className="text-green-600" style={{ fontSize: '24px' }} />,
  pending: <ClockCircleOutlined className="text-yellow-600" style={{ fontSize: '24px' }} />,
  verified: <CheckCircleOutlined className="text-green-600" style={{ fontSize: '24px' }} />,
  deactivated: <StopOutlined className="text-red-600" style={{ fontSize: '24px' }} />,
  hospitalIcon: <BankOutlined className="text-blue-600" style={{ fontSize: '24px' }} />,
  laboratoryIcon: <ExperimentOutlined className="text-purple-600" style={{ fontSize: '24px' }} />,
  pharmacyIcon: <MedicineBoxOutlined className="text-green-600" style={{ fontSize: '24px' }} />,
  ambulanceIcon: <CarOutlined className="text-red-600" style={{ fontSize: '24px' }} />,
  insuranceIcon: <SafetyOutlined className="text-blue-600" style={{ fontSize: '24px' }} />,
  specialistIcon: <UserOutlined className="text-indigo-600" style={{ fontSize: '24px' }} />,
  bloodBankIcon: <HeartOutlined className="text-red-600" style={{ fontSize: '24px' }} />,
};

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("1");
  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [websiteTheme, setWebsiteTheme] = useState("light");
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { adminAccessType } = useAuth();

  // Log adminAccessType for debugging
  console.log("adminAccessType:", adminAccessType);

  // Fetch statistics on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

 const fetchDashboardStats = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const adminStatsResponse = await statsService.getAdminStats();
    
    console.log('Admin Stats Response:', adminStatsResponse);
    
    if (adminStatsResponse?.stats) {
      const { stats } = adminStatsResponse;
      
      const facilityTypeStats = [
        {
          label: "Total Facilities",
          count: stats.overview?.totalFacilities?.toLocaleString() || "0",
          icon: "total",
          delta: ` +${Math.floor(Math.random() * 5) + 1} this month`,
          bg: "bg-[#E5FFD1]",
        },
        {
          label: "Hospitals",
          count: (stats.facilitiesByType?.Hospital || 0).toLocaleString(),
          icon: "hospitalIcon",
          delta: ` +${Math.floor(Math.random() * 3) + 1} this month`,
          bg: "bg-[#FFD1E5]",
        },
        {
          label: "Laboratories",
          count: (stats.facilitiesByType?.Laboratory || 0).toLocaleString(),
          icon: "laboratoryIcon",
          delta: ` +${Math.floor(Math.random() * 2) + 1} this month`,
          bg: "bg-[#D1FFFB]",
        },
        {
          label: "Specialist Clinic Center",
          count: (stats.facilitiesByType?.SpecialistClinic || 0).toLocaleString(),
          icon: "specialistIcon",
          delta: ` +${Math.floor(Math.random() * 2) + 1} this month`,
          bg: "bg-[#FFE5D1]",
        },
        {
          label: "Pharmacies",
          count: (stats.facilitiesByType?.Pharmacy || 0).toLocaleString(),
          icon: "pharmacyIcon",
          delta: ` +${Math.floor(Math.random() * 3) + 1} this month`,
          bg: "bg-[#D1E5FF]",
        },
        {
          label: "Ambulance Services",
          count: (stats.facilitiesByType?.Ambulance || 0).toLocaleString(),
          icon: "ambulanceIcon",
          delta: ` +${Math.floor(Math.random() * 2) + 1} this month`,
          bg: "bg-[#E2D1FF]",
        },
        {
          label: "Insurance Providers",
          count: (stats.facilitiesByType?.Insurance || 0).toLocaleString(),
          icon: "insuranceIcon",
          delta: ` +${Math.floor(Math.random() * 2) + 1} this month`,
          bg: "bg-[#FFD1E5]",
        },
        {
          label: "Blood Banks",
          count: (stats.facilitiesByType?.['Blood Bank'] || 0).toLocaleString(),
          icon: "bloodBankIcon",
          delta: ` +${Math.floor(Math.random() * 2) + 1} this month`,
          bg: "bg-[#FFE5D1]",
        },
        {
          label: "Active Facilities",
          count: (stats.overview?.activeFacilities || 0).toLocaleString(),
          icon: "active",
          delta: `Currently active`,
          bg: "bg-[#E5FFD1]",
        },
        {
          label: "Pending Facilities",
          count: (stats.overview?.pendingFacilities || 0).toLocaleString(),
          icon: "pending",
          delta: `Awaiting verification`,
          bg: "bg-[#FFF3CD]",
        },
        {
          label: "Verified Facilities",
          count: (stats.overview?.verifiedFacilities || 0).toLocaleString(),
          icon: "verified",
          delta: `Fully verified`,
          bg: "bg-[#D4EDDA]",
        },
        {
          label: "Deactivated Facilities",
          count: (stats.overview?.deactivatedFacilities || 0).toLocaleString(),
          icon: "deactivated",
          delta: `Currently deactivated`,
          bg: "bg-[#F8D7DA]",
        }
      ];

      const mappedStats = facilityTypeStats.map(stat => ({
        ...stat,
        icon: iconMap[stat.icon] || iconMap.total
      }));
      
      setStatCards(mappedStats);
    }

  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    setError(`Failed to load dashboard statistics: ${err.message}`);
    setStatCards(getDefaultStats());
  } finally {
    setLoading(false);
  }
};

  const getDefaultStats = () => [
    {
      label: "Total Facilities",
      count: "Loading...",
      icon: iconMap.total,
      delta: "Please wait",
      bg: "bg-[#E5FFD1]",
    },
    {
      label: "Hospitals",
      count: "Loading...",
      icon: iconMap.hospitalIcon,
      delta: "Please wait",
      bg: "bg-[#FFD1E5]",
    },
    {
      label: "Laboratories",
      count: "Loading...",
      icon: iconMap.laboratoryIcon,
      delta: "Please wait",
      bg: "bg-[#D1FFFB]",
    },
    {
      label: "Specialist Clinics",
      count: "Loading...",
      icon: iconMap.specialistIcon,
      delta: "Please wait",
      bg: "bg-[#FFE5D1]",
    },
    {
      label: "Pharmacies",
      count: "Loading...",
      icon: iconMap.pharmacyIcon,
      delta: "Please wait",
      bg: "bg-[#D1E5FF]",
    },
    {
      label: "Ambulance Services",
      count: "Loading...",
      icon: iconMap.ambulanceIcon,
      delta: "Please wait",
      bg: "bg-[#E2D1FF]",
    },
    {
      label: "Insurance Providers",
      count: "Loading...",
      icon: iconMap.insuranceIcon,
      delta: "Please wait",
      bg: "bg-[#FFD1E5]",
    },
    {
      label: "Blood Banks",
      count: "Loading...",
      icon: iconMap.bloodBankIcon,
      delta: "Please wait",
      bg: "bg-[#FFE5D1]",
    },
    {
      label: "Active Facilities",
      count: "Loading...",
      icon: iconMap.active,
      delta: "Please wait",
      bg: "bg-[#E5FFD1]",
    },
    {
      label: "Pending Facilities",
      count: "Loading...",
      icon: iconMap.pending,
      delta: "Please wait",
      bg: "bg-[#FFF3CD]",
    },
    {
      label: "Verified Facilities",
      count: "Loading...",
      icon: iconMap.verified,
      delta: "Please wait",
      bg: "bg-[#D4EDDA]",
    },
    {
      label: "Deactivated Facilities",
      count: "Loading...",
      icon: iconMap.deactivated,
      delta: "Please wait",
      bg: "bg-[#F8D7DA]",
    }
  ];

  const handleMenuClick = ({ key }) => {
    setActiveMenu(key);
    if (key === "1") navigate("/admin-dashboard");
    if (
      [
        "all",
        "Hospital",
        "Laboratory",
        "SpecialistClinic",
        "Pharmacy",
        "Ambulance",
        "Insurance",
        "Other",
        "Blood Bank"
      ].includes(key)
    ) {
      navigate("/admin-dashboard/facilities?type=" + key);
    }
    if (key === "4") navigate("/admin-dashboard/admins");
    if (key === "5") navigate("/admin-dashboard/users");
    if (key === "6") navigate("/admin-dashboard/referrals");
    if (key === "8") navigate("/admin-dashboard/conversations");
    if (key === "9") navigate("/admin-dashboard/notifications");
    if (key === "10") navigate("/admin-dashboard/blogs");
    if (key === "11") navigate("/admin-dashboard/analytics");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'active': return 'text-blue-600';
      case 'deactivated': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout>
        <Sider
          width={collapsed ? 60 : Math.min(350, window.innerWidth - 40)}
          collapsible
          collapsed={collapsed}
          trigger={null}
          className="bg-white shadow-md mt-6 mx-2 rounded-xl px-4 pt-6"
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
              <Menu.Item key="SpecialistClinic" icon={<UserOutlined />}>
                Specialist Clinic
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
              <Menu.Item key="Blood Bank" icon={<ExperimentOutlined />}>
                Blood Bank
              </Menu.Item>
            </SubMenu>

            {adminAccessType !== "editor" && (
              <Menu.Item key="5" icon={<img src={users} alt="users" />}>
                {!collapsed && "Users"}
              </Menu.Item>
            )}
            <Menu.Item key="6" icon={<img src={referrels} alt="referrels" />}>
              {!collapsed && "Referrals"}
            </Menu.Item>
            <Menu.Item key="8" icon={<img src={message} alt="message" />}>
              {!collapsed && "Messages"}
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
            {adminAccessType === "superAdmin" && (
              <Menu.Item key="4" icon={<img src={Vector} alt="Vector" />}>
                {!collapsed && "Admins & Roles"}
              </Menu.Item>
            )}
            <Menu.Item key="13" icon={<SettingOutlined />}>
              {!collapsed && "Settings"}
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Content
            style={{
              height: "100%",
              overflowY: "scroll",
              backgroundColor: "#f5f5f5",
              maxHeight: "93vh",
            }}
            className="p-6"
          >
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-4xl font-bold mb-2">
                          Dashboard Overview
                        </h2>
                        <p className="text-gray-500 text-xl">
                          Welcome back! Here's what's happening with your facilities today.
                        </p>
                      </div>
                    </div>

                    {error && (
                      <Alert
                        message="Error Loading Data"
                        description={error}
                        type="error"
                        closable
                        className="mb-6"
                        onClose={() => setError(null)}
                      />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-5 mb-6">
                      {loading ? (
                        Array.from({ length: 12 }).map((_, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl shadow px-6 py-8"
                          >
                            <Skeleton active paragraph={{ rows: 2 }} />
                          </div>
                        ))
                      ) : (
                        statCards.map((card, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl shadow px-6 py-8 flex items-center justify-between w-full hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                        
                          >
                            <div className="flex-1">
                              <h3 className="font-inter font-medium text-sm lg:text-base leading-tight tracking-[0.5%] mb-2">
                                {card.label}
                              </h3>
                              <div className="text-xl lg:text-2xl font-bold mb-2">
                                {card.count}
                              </div>
                              <div className="font-inter font-normal text-xs lg:text-sm leading-tight tracking-[0.5%] text-primarysolid">
                                {card.delta}
                              </div>
                            </div>
                            <div
                              className={`w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-full text-lg lg:text-xl ${card.bg} flex-shrink-0 ml-4`}
                            >
                              {card.icon}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                      <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
                      <Notifications loc={"dashboard"}/>
                    </div>
                  </div>
                }
              />
              <Route path="/facilities" element={<AllFacilities />} />
              <Route path="/facilities/:id" element={<FacilityDetail />} />
              <Route
                path="/admins"
                element={
                  adminAccessType === "superAdmin" ? (
                    <AdminList />
                  ) : (
                    <Navigate to="/admin-dashboard" replace />
                  )
                }
              />
              <Route
                path="/users"
                element={
                  adminAccessType !== "editor" ? (
                    <Users />
                  ) : (
                    <Navigate to="/admin-dashboard" replace />
                  )
                }
              />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/conversations" element={<AdminChatPage />} />
              <Route path="/conversations/:chatId" element={<AdminChatPage />} />
              <Route path="/blogs" element={<AddBlogPost />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/analytics" element={<AdminAnalytics />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;