import React, { useEffect, useState } from "react";
import { Progress, Card, Row, Col, message, Skeleton } from "antd";
import { Content } from "antd/es/layout/layout";
import { useAuth } from "../hook/auth";
import { Subspecialties } from "./subspecialities .jsx";

import referral from "../../components/asstes/Referrals.png";
import Profile from "../../components/asstes/profile.png";
import Totalreferral from "../../components/asstes/TotalReferrals.png";
import { Button } from "../button.jsx";
import { updateFacility } from "../../services/auth.js";
import { FacilityServices, GetFacilityService } from "../../services/service.js";
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

export default function DashboardHome() {
  const { facilityType, authData, updateIsAmbulance } = useAuth();

  const [subSpecialities, setSubspecialities] = useState([]);
  const [loadingService, setLoadingService] = useState(false);
  const [saving, setSaving] = useState(false);

  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const getNotificationMessage = (action) => {
    switch (action) {
      case "ACCOUNT_CREATED":
        return "Your account has been successfully created. Let’s complete your onboarding to get started!";
      case "RESET_PASSWORD":
        return "Your password has been reset. If this wasn’t you, please secure your account immediately.";
      case "FACILITY_INFO_UPDATED":
        return "Your facility information has been successfully updated.";
      case "SERVICES_UPDATE":
        return "Your service offerings and capacity have been updated successfully.";
      case "DOCUMENT_UPDATE":
        return "Your facility documents were uploaded/updated successfully.";
      case "UPDATED_PROFILE_PROGRESS":
        return "Your profile setup is progressing. Keep going to complete it!";
      case "ONBOARDING_COMPLETED":
        return "Congratulations! You’ve successfully completed your onboarding process.";
      case "PROFILE_IMAGE_UPDATED":
        return "Your profile picture has been updated.";
      default:
        return "You have a new update or activity in your account.";
    }
  };


  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/notifications/facility/${authData?._id}?page=1&limit=5`
      );
      setRecentActivity(res.data.notifications?.slice(0, 5) || []);
    } catch (err) {
      message.error("Failed to load notifications.");
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    if (authData?._id) {
      fetchNotifications();
    }
  }, [authData?._id]);

  useEffect(() => {
    const getFacilityServices = async () => {
      if (authData?._id) {
        setLoadingService(true);
        try {
          const response = await GetFacilityService();
          const serviceData = response?.service;

          if (
            Array.isArray(serviceData?.hospitalDetails?.facilityFeatures) &&
            serviceData.hospitalDetails.facilityFeatures.includes("ambulance")
          ) {
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
            <p className="text-base text-primarysolid">+0 this week</p>
            <div className="w-14 h-14 bg-[#E5FFD1] rounded-full absolute top-5 right-7 flex items-center justify-center">
              <img src={referral} alt="Referral" />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none relative">
            <p className="text-base text-gray-500">Total Referrals</p>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-base text-primarysolid">+0 this month</p>
            <div className="w-14 h-14 bg-[#D1FFFB] rounded-full absolute top-5 right-7 flex items-center justify-center">
              <img src={Totalreferral} alt="Total Referrals" />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="rounded-xl shadow border-none relative">
            <p className="text-base text-gray-500">Profile Completion</p>
            <p className="text-2xl font-bold text-primary">
              {authData?.profileCompletion === 100 ? "100%" : `${authData?.profileCompletion || 0}%`}
            </p>
            <p className="text-base text-gray-800">
              {authData?.profileCompletion === 100 ? "Your profile is complete" : "Continue completing profile"}
            </p>
            <div className="w-14 h-14 bg-[#D1E5FF] rounded-full absolute top-5 right-7 flex items-center justify-center">
              <img src={Profile} alt="Profile" />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className="mt-6 rounded-xl shadow border-none h-full">
            <Content className="p-4 flex flex-col">
              <h2 className="font-inter font-semibold text-2xl leading-[24px] tracking-[0.5%] text-[#1f2937] mb-4">
                Recent Activity
              </h2>

              <Skeleton loading={loadingNotifications} active paragraph={{ rows: 4 }}>
                {recentActivity.length > 0 ? (
                  <ul className="space-y-3">
                    {recentActivity.map((notification) => (
                      <li
                        key={notification._id}
                        className="bg-[#c1e3ff] p-4 rounded-lg shadow-sm border-[#AADEE6"
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
                  !loadingNotifications && (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="font-inter font-normal text-lg tracking-[0.5%] text-gray-600">
                        No recent activity
                      </p>
                    </div>
                  )
                )}
              </Skeleton>
            </Content>
          </Card>
        </Col>

        {facilityType === "Hospital" && authData?._id && (
          <Col xs={24} md={24} className="mt-6">
            <Card className="rounded-xl shadow border-none">
              <Subspecialties
                subSpecialities={subSpecialities}
                setSubspecialities={setSubspecialities}
                loading={loadingService}
              />
              <div className="flex justify-end">
                <Button
                  className="h-12 mt-3 px-6 bg-primarysolid text-white rounded-md"
                  onClick={handleSave} loading={saving} disabled={saving || loadingService}>
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
