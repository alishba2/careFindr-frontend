import React, { useEffect, useState, useRef } from "react";
import {
  List,
  Spin,
  Alert,
  Typography,
  Badge,

  Tooltip,
  message,
} from "antd";
import { BellOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../hook/auth";
import { Button } from "../button";
const { Title, Text } = Typography;
const backendUrl = import.meta.env.VITE_APP_BASE_URL;


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


/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Displays a list of notifications for a facility.
 *
 * The component fetches the notifications from the server and displays them
 * in a list. It also provides a button to mark all notifications as read.
 *
 * The notifications are fetched from the server and marked as read every time
 * the component is mounted. The component also listens for changes to the
 * notifications and updates the list accordingly.
 *
 * @returns {React.Component} A React component that displays a list of notifications.
 */
/*******  ad980468-22c9-486f-9644-3c5d55993ab8  *******/const Notifications = () => {
  const { authData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const facilityId = authData?._id;

  // 👇 Ref to track if silent read already done
  const hasMarkedSilently = useRef(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/notifications/${facilityId}?page=1&limit=10`
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markUnreadAsReadSilently = async () => {
    if (hasMarkedSilently.current) return; // 👈 Already done
    try {
      await axios.put(`${backendUrl}/api/notifications/mark-all-read/${facilityId}`);
      hasMarkedSilently.current = true; // 👈 Marked so won't repeat
    } catch (err) {
      console.error("Silent mark as read failed:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${backendUrl}/api/notifications/mark-all-read/${facilityId}`);
      message.success("All notifications marked as read.");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
      message.error("Failed to mark notifications as read.");
    }
  };

  useEffect(() => {
    if (facilityId) {
      fetchNotifications().then(() => {
        markUnreadAsReadSilently(); // 👈 only after fetch
      });
    }
  }, [facilityId]);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex items-center gap-2">
          <BellOutlined style={{ fontSize: 24, color: "#0C7792" }} />
          <Title
            level={3}
            style={{ margin: 0, fontSize: "1.25rem", "@media (max-width: 500px)": { fontSize: "1rem" } }}
          >
            Notifications
          </Title>
        </div>
        <Tooltip title="Mark all as read">
          <Button
            type="primary"
            className="bg-primarysolid hover:bg-primarysolid hidden md:flex"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </Button>
        </Tooltip>
      </div>

      {loading ? (
        <div className="flex justify-center my-10">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : notifications.length === 0 ? (
        <Text>No notifications found.</Text>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className="bg-[#c1e3ff] p-4 rounded-lg shadow-sm border border-[#AADEE6]"

              style={{
                backgroundColor: !item.isRead ? "transparent" : "#c1e3ff",
                borderRadius: 8,
                marginBottom: 8,
                padding: 16,
              }}

            >
              <List.Item.Meta
                avatar={
                  !item.isRead ? (
                    <Badge
                      status="processing"
                      color="#1890ff"
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                      }}
                    />
                  ) : null
                }
                title={<Text>{getNotificationMessage(item.action)}</Text>}
                description={
                  <Text type="secondary">
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Notifications;
