import React, { useEffect, useState } from "react";
import { Progress, Card, Row, Col, message } from "antd";
import { Content } from "antd/es/layout/layout";
import { useAuth } from "../hook/auth";
import { Subspecialties } from "./subspecialities .jsx";

import referral from "../../components/asstes/Referrals.png";
import Profile from "../../components/asstes/profile.png";
import Totalreferral from "../../components/asstes/TotalReferrals.png";
import { Button } from "../button.jsx";
import { updateFacility } from "../../services/auth.js";
import { FacilityServices, GetFacilityService } from "../../services/service.js";
const backendUrl = import.meta.env.VITE_APP_BASE_URL;
import axios from "axios";
export default function DashboardHome() {
  const { facilityType, authData, updateIsAmbulance } = useAuth();
  const [subSpecialities, setSubspecialities] = useState([]);
  const [loadingService, setLoadingService] = useState(false);
  const [saving, setSaving] = useState(false);

  const [recentActivity, setRecentActivity] = useState([]);
  const getNotificationMessage = (action) => {
    switch (action) {
      case "ACCOUNT_CREATED":
        return "👋 Welcome to the careFindr! Please complete your onboarding process.";
      case "RESET_PASSWORD":
        return "🔐 Your password has been reset.";
      case "FACILITY_INFO_UPDATED":
        return "🏥 Facility information updated.";
      case "SERVICES_UPDATE":
        return "🛠️ Services & capacity updated.";
      case "DOCUMENT_UPDATE":
        return "📄 Documents updated successfully!";
      case "UPDATED_PROFILE_PROGRESS":
        return "📈 Profile progress updated.";
      case "ONBOARDING_COMPLETED":
        return "✅ Onboarding process completed.";
      case "PROFILE_IMAGE_UPDATED":
        return "🖼️ Profile image updated.";
      default:
        return "🔔 New notification.";
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/notifications/${authData?._id}?page=1&limit=5`
      );

      console.log(res, "response hre");
      setRecentActivity(res.data.notifications?.slice(0, 5) || []);
    } catch (err) {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [authData?._id])

  useEffect(() => {
    const getFacilityServices = async () => {
      if (authData?._id) {
        setLoadingService(true);
        try {
          const response = await GetFacilityService();
          const serviceData = response?.service;

          console.log(serviceData, "service data is here")

          console.log(Array.isArray(serviceData?.hospitalDetails?.facilityFeatures), "facility feature array");
          if (serviceData?.hospitalDetails?.facilityFeatures?.includes('ambulance')) {
            console.log("yes has ambulanceeeeeeee");
            updateIsAmbulance(true);
          }

          if (serviceData?.facilityType === "Hospital") {
            setSubspecialities(serviceData.hospitalDetails?.subSpecialities || []);
          }
        } catch (error) {
          console.error("Error fetching service:", error);
          setSubspecialities([]);
        } finally {
          setLoadingService(false);
        }
      }
    };

    getFacilityServices();
  }, [authData?._id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const serviceData = {
        facilityId: authData?._id,
        facilityType,
        serviceType: "partial",
        hospitalDetails: {
          subSpecialities,
        },
      };

      await FacilityServices(serviceData);
      message.success("Subspecialties saved successfully ✅");
    } catch (err) {
      console.error(err);
      message.error("Failed to save subspecialties ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Content className="h-full">
      <div className="font-inter font-semibold text-3xl leading-[36px] tracking-[0.5%] mb-1">
        Dashboard Overview
      </div>
      <p className="font-inter font-normal text-lg leading-28px tracking-[0.5%] text-gray-600 mb-6">
        Welcome back! Here's what's happening with your facility today.
      </p>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none relative">
            <p className="text-base text-gray-500">New Referrals</p>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-base text-[#259678]">+0 this week</p>
            <div className="w-14 h-14 bg-[#E5FFD1] rounded-full absolute top-5 right-7 flex items-center justify-center">
              <img src={referral} alt="Referral" />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none relative">
            <p className="text-base text-gray-500">Total Referrals</p>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-base text-[#259678]">+0 this month</p>
            <div className="w-14 h-14 bg-[#D1FFFB] rounded-full absolute top-5 right-7 flex items-center justify-center">
              <img src={Totalreferral} alt="Total Referrals" />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none relative">
            <p className="text-base text-gray-500">Profile Completion</p>
            <p className="text-2xl font-bold text-primary">
              {authData?.profileCompletion || 0}%
            </p>
            <p className="text-base text-gray-800">Continue completing profile</p>
            <div className="w-14 h-14 bg-[#D1E5FF] rounded-full absolute top-5 right-7 flex items-center justify-center">
              <img src={Profile} alt="Profile" />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className="mt-6 rounded-xl shadow border-none h-full">
            <Content className="p-6 flex flex-col">
              <h2 className="font-inter font-semibold text-2xl leading-[24px] tracking-[0.5%] text-[#1f2937] mb-4">
                Recent Activity
              </h2>

              {recentActivity.length > 0 ? (
                <ul className="space-y-3">
                  {recentActivity.map((notification) => (
                    <li
                      key={notification._id}
                      className="bg-gray-100 p-4 rounded-lg shadow-sm"
                    >
                      <p className="text-base text-gray-800 font-medium">
                        {getNotificationMessage(notification.action)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="font-inter font-normal text-lg tracking-[0.5%] text-gray-600">
                    No recent activity
                  </p>
                </div>
              )}
            </Content>
          </Card>
        </Col>


        {facilityType === "Hospital" && (
          <Col xs={24} md={24} className="mt-6">
            <Card className="rounded-xl shadow border-none">
              <Subspecialties
                subSpecialities={subSpecialities}
                setSubspecialities={setSubspecialities}
                loading={loadingService}
              />
              <div className="flex justify-end">
                <Button onClick={handleSave} loading={saving} disabled={saving || loadingService}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </Content>
  );
}
