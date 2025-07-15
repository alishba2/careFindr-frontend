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
  LoadingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Spin, Alert, Skeleton } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import AllFacilities from "./allFacilities";
import AdminList from "./admin";
import FacilityDetail from "./facility-detail";
import Users from "./users";
import Referrals from "./referrals";
import Navbar from "../pages/navbar";
import Notifications from "./notifications";
import { AdminAnalytics } from "./analytics";
import AdminChatPage from "./converstaions";
import BlogUI from "./blog";
import AddBlogPost from "./blog";

// Import stats service
import statsService from "../../services/statsService";

// Import your existing icons
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

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

// Icon mapping for dynamic stats
const iconMap = {
  color: <img src={color} alt="color" />,
  file: <img src={file} alt="file" />,
  hospital: <img src={falities} alt="hospital" />,
  lab: <img src={lab} alt="lab" />,
  car: <img src={car} alt="car" />,
  register: <img src={register} alt="register" />,
  time: <img src={time} alt="time" />,
  facilities: <img src={falities} alt="facilities" />,
};

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("1");
  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch statistics on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get comprehensive admin stats
      const adminStatsResponse = await statsService.getAdminStats();
      
      console.log('Admin Stats Response:', adminStatsResponse);
      
      if (adminStatsResponse?.stats) {
        const { stats } = adminStatsResponse;
        
        // Create stat cards from the comprehensive data
        const facilityTypeStats = [
          {
            label: "Total Facilities",
            count: stats.overview?.totalFacilities?.toLocaleString() || "0",
            icon: "color",
            delta: `Total registered facilities`,
            bg: "bg-[#E5FFD1]",
          },
          {
            label: "Hospitals",
            count: (stats.facilitiesByType?.Hospital || 0).toLocaleString(),
            icon: "hospital",
            delta: `Hospital facilities`,
            bg: "bg-[#FFD1E5]",
          },
          {
            label: "Laboratories",
            count: (stats.facilitiesByType?.Laboratory || 0).toLocaleString(),
            icon: "lab",
            delta: `Laboratory facilities`,
            bg: "bg-[#D1FFFB]",
          },
          {
            label: "Specialist Clinics",
            count: (stats.facilitiesByType?.SpecialistClinic || 0).toLocaleString(),
            icon: "time",
            delta: `Specialist clinic facilities`,
            bg: "bg-[#FFE5D1]",
          },
          {
            label: "Pharmacies",
            count: (stats.facilitiesByType?.Pharmacy || 0).toLocaleString(),
            icon: "file",
            delta: `Pharmacy facilities`,
            bg: "bg-[#D1E5FF]",
          },
          {
            label: "Ambulance Services",
            count: (stats.facilitiesByType?.Ambulance || 0).toLocaleString(),
            icon: "car",
            delta: `Ambulance service providers`,
            bg: "bg-[#E2D1FF]",
          },
          {
            label: "Insurance Providers",
            count: (stats.facilitiesByType?.Insurance || 0).toLocaleString(),
            icon: "register",
            delta: `Insurance providers`,
            bg: "bg-[#FFD1E5]",
          },
          {
            label: "Blood Banks",
            count: (stats.facilitiesByType?.['Blood Bank'] || 0).toLocaleString(),
            icon: "lab",
            delta: `Blood bank facilities`,
            bg: "bg-[#FFE5D1]",
          },
          {
            label: "Active Facilities",
            count: (stats.overview?.activeFacilities || 0).toLocaleString(),
            icon: "color",
            delta: `Currently active`,
            bg: "bg-[#E5FFD1]",
          },
          {
            label: "Pending Facilities",
            count: (stats.overview?.pendingFacilities || 0).toLocaleString(),
            icon: "time",
            delta: `Awaiting verification`,
            bg: "bg-[#FFE5D1]",
          },
          {
            label: "Verified Facilities",
            count: (stats.overview?.verifiedFacilities || 0).toLocaleString(),
            icon: "register",
            delta: `Fully verified`,
            bg: "bg-[#E5FFD1]",
          },
          {
            label: "Deactivated Facilities",
            count: (stats.overview?.deactivatedFacilities || 0).toLocaleString(),
            icon: "car",
            delta: `Currently deactivated`,
            bg: "bg-[#FFD1E5]",
          }
        ];

        // Map icons and set the stats
        const mappedStats = facilityTypeStats.map(stat => ({
          ...stat,
          icon: iconMap[stat.icon] || iconMap.file
        }));
        
        setStatCards(mappedStats);
      }

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(`Failed to load dashboard statistics: ${err.message}`);
      
      // Fallback to default stats if API fails
      setStatCards(getDefaultStats());
    } finally {
      setLoading(false);
    }
  };

  // Fallback default stats in case API fails
  const getDefaultStats = () => [
    {
      label: "Total Facilities",
      count: "Loading...",
      icon: iconMap.color,
      delta: "Please wait",
      bg: "bg-[#E5FFD1]",
    },
    {
      label: "Hospitals",
      count: "Loading...",
      icon: iconMap.hospital,
      delta: "Please wait",
      bg: "bg-[#FFD1E5]",
    },
    {
      label: "Laboratories",
      count: "Loading...",
      icon: iconMap.lab,
      delta: "Please wait",
      bg: "bg-[#D1FFFB]",
    },
    {
      label: "Specialist Clinics",
      count: "Loading...",
      icon: iconMap.time,
      delta: "Please wait",
      bg: "bg-[#FFE5D1]",
    },
    {
      label: "Pharmacies",
      count: "Loading...",
      icon: iconMap.file,
      delta: "Please wait",
      bg: "bg-[#D1E5FF]",
    },
    {
      label: "Ambulance Services",
      count: "Loading...",
      icon: iconMap.car,
      delta: "Please wait",
      bg: "bg-[#E2D1FF]",
    },
    {
      label: "Insurance Providers",
      count: "Loading...",
      icon: iconMap.register,
      delta: "Please wait",
      bg: "bg-[#FFD1E5]",
    },
    {
      label: "Blood Banks",
      count: "Loading...",
      icon: iconMap.lab,
      delta: "Please wait",
      bg: "bg-[#FFE5D1]",
    },
    {
      label: "Active Facilities",
      count: "Loading...",
      icon: iconMap.color,
      delta: "Please wait",
      bg: "bg-[#E5FFD1]",
    },
    {
      label: "Pending Facilities",
      count: "Loading...",
      icon: iconMap.time,
      delta: "Please wait",
      bg: "bg-[#FFE5D1]",
    },
    {
      label: "Verified Facilities",
      count: "Loading...",
      icon: iconMap.register,
      delta: "Please wait",
      bg: "bg-[#E5FFD1]",
    },
    {
      label: "Deactivated Facilities",
      count: "Loading...",
      icon: iconMap.car,
      delta: "Please wait",
      bg: "bg-[#FFD1E5]",
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
        "Clinic",
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
              <Menu.Item key="Blood Bank" icon={<ExperimentOutlined />}>
                Blood Bank
              </Menu.Item>
            </SubMenu>

            <Menu.Item key="5" icon={<img src={users} alt="users" />}>
              {!collapsed && "Users"}
            </Menu.Item>
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
            <Menu.Item key="4" icon={<img src={Vector} alt="Vector" />}>
              {!collapsed && "Admins & Roles"}
            </Menu.Item>
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
                      
                      {/* <Button 
                        icon={<LoadingOutlined spin={loading} />}
                        onClick={fetchDashboardStats}
                        disabled={loading}
                        className="flex items-center"
                      >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                      </Button> */}
                    </div>

                    {/* Error Alert */}
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-5 mb-6">
                      {loading ? (
                        // Loading skeletons
                        Array.from({ length: 12 }).map((_, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl shadow px-6 py-8"
                          >
                            <Skeleton active paragraph={{ rows: 2 }} />
                          </div>
                        ))
                      ) : (
                        // Actual stats cards
                        statCards.map((card, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl shadow px-6 py-8 flex items-center justify-between w-full hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                            onClick={() => {
                              // Navigate to relevant section based on card type
                              if (card.label.includes('Pending')) {
                                navigate('/admin-dashboard/facilities?type=all&status=Pending');
                              } else if (card.label.includes('Active')) {
                                navigate('/admin-dashboard/facilities?type=all&status=Active');
                              } else if (card.label.includes('Verified')) {
                                navigate('/admin-dashboard/facilities?type=all&status=Verified');
                              } else if (card.label.includes('Deactivated')) {
                                navigate('/admin-dashboard/facilities?type=all&status=Deactivated');
                              } else if (card.label === 'Hospitals') {
                                navigate('/admin-dashboard/facilities?type=Hospital');
                              } else if (card.label === 'Laboratories') {
                                navigate('/admin-dashboard/facilities?type=Laboratory');
                              } else if (card.label === 'Specialist Clinics') {
                                navigate('/admin-dashboard/facilities?type=SpecialistClinic');
                              } else if (card.label === 'Pharmacies') {
                                navigate('/admin-dashboard/facilities?type=Pharmacy');
                              } else if (card.label === 'Ambulance Services') {
                                navigate('/admin-dashboard/facilities?type=Ambulance');
                              } else if (card.label === 'Insurance Providers') {
                                navigate('/admin-dashboard/facilities?type=Insurance');
                              } else if (card.label === 'Blood Banks') {
                                navigate('/admin-dashboard/facilities?type=Blood Bank');
                              } else {
                                navigate('/admin-dashboard/facilities');
                              }
                            }}
                          >
                            <div className="flex-1">
                              <h3 className="font-inter font-medium text-sm lg:text-base leading-tight tracking-[0.5%] mb-2">
                                {card.label}
                              </h3>
                              <div className="text-xl lg:text-2xl font-bold mb-2">
                                {card.count}
                              </div>
                              <div className="font-inter font-normal text-xs lg:text-sm leading-tight tracking-[0.5%] text-[#259678]">
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

                    {/* Summary Section */}
                    <div className="bg-white rounded-xl shadow p-6">
                      <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>

                      <Notifications loc={"dashboard"}/>
                     
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
              <Route path="/conversations/:chatId" element={<AdminChatPage />} />
              <Route path="blogs" element={<AddBlogPost />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;