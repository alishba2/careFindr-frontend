import React, { useEffect, useState, useRef } from "react";
import {
  List,
  Spin,
  Alert,
  Typography,
  Badge,
  Tooltip,
  message,
  Pagination,
  Row,
  Col,
} from "antd";
import { BellOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../hook/auth";
import { Button } from "../button";

import {  getNotificationMessage, 
  getNotificationStyle, 
  getBadgeColor,
  formatNotificationDate  } from "./notificationUtility";

const { Title, Text } = Typography;
const backendUrl = import.meta.env.VITE_APP_BASE_URL;

const Notifications = () => {
  const { authData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const facilityId = authData?._id;

  // 👇 Ref to track if silent read already done
  const hasMarkedSilently = useRef(false);

  const fetchNotifications = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/notifications/facility/${facilityId}?page=${page}&limit=${limit}`
      );

      if (res.data) {
        setNotifications(res.data.notifications || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      setError("Failed to load notifications.");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markUnreadAsReadSilently = async () => {
    if (hasMarkedSilently.current) return; // 👈 Already done
    try {
      await axios.put(`${backendUrl}/api/notifications/mark-all-read/${facilityId}`);
      hasMarkedSilently.current = true; // 👈 Marked so won't repeat

      // Update local state to reflect the change
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
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
      hasMarkedSilently.current = true; // Update the ref as well
    } catch (err) {
      console.error("Error marking all as read:", err);
      message.error("Failed to mark notifications as read.");
    }
  };

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    if (pageSize !== itemsPerPage) {
      setItemsPerPage(pageSize);
      setCurrentPage(1); // Reset to first page when changing page size
    }
    fetchNotifications(pageSize !== itemsPerPage ? 1 : page, pageSize);
  };

  // Handle page size change
  const handlePageSizeChange = (current, size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
    fetchNotifications(1, size);
  };

  // useEffect(() => {
  //   if (facilityId) {
  //     fetchNotifications(currentPage, itemsPerPage).then(() => {
  //       // Only mark as read silently on first load (page 1)
  //       if (currentPage === 1) {
  //         markUnreadAsReadSilently();
  //       }
  //     });
  //   }
  // }, [facilityId]);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BellOutlined style={{ fontSize: 24, color: "#0C7792" }} />
          <Title
            level={3}
            style={{
              margin: 0,
              fontSize: "1.25rem",
              "@media (max-width: 500px)": { fontSize: "1rem" }
            }}
          >
            Notifications
          </Title>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification count info */}
          {!loading && totalCount > 0 && (
            <Text type="secondary" className="hidden sm:block">
              {totalCount} total • Page {currentPage} of {totalPages}
            </Text>
          )}

          {/* Mark all as read button */}
          <Tooltip title="Mark all as read">
            <Button
              type="primary"
              className="bg-primarysolid hover:bg-primarysolid"
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.isRead)}
            >
              <span className="hidden md:inline">Mark All as Read</span>
              <span className="md:hidden">Mark All</span>
            </Button>
          </Tooltip>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-10">
          <Spin size="large" tip="Loading notifications..." />
        </div>
      ) : error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => fetchNotifications(currentPage, itemsPerPage)}>
              Retry
            </Button>
          }
        />
      ) : notifications.length === 0 ? (
        <div className="text-center py-8">
          <BellOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
          <Text className="block text-gray-500">No notifications found.</Text>
        </div>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                style={getNotificationStyle(item.action, item.isRead)}
                className="transition-all duration-200 hover:shadow-sm"
              >
                <List.Item.Meta
                  avatar={
                    !item.isRead ? (
                      <Badge
                        status="processing"
                        color={getBadgeColor(item.action)}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <CheckCircleTwoTone
                        twoToneColor={getBadgeColor(item.action)}
                        style={{ fontSize: 12, opacity: 0.6 }}
                      />
                    )
                  }
                  title={
                    <Text strong={!item.isRead}>
                      {getNotificationMessage(item.action)}
                    </Text>
                  }
                  description={
                    <Text type="secondary" className="text-sm">
                      {formatNotificationDate(item.createdAt)}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <Row justify="center" align="middle" className="flex-wrap gap-2">
                {/* Pagination controls */}
                <div className="flex justify-center md:justify-end">
                  <Pagination
                    align="center"
                    current={currentPage}
                    total={totalCount}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total, range) =>
                      window.innerWidth >= 640
                        ? `${range[0]}-${range[1]} of ${total}`
                        : `${range[0]}-${range[1]}` // Shorter text on mobile
                    }
                    pageSizeOptions={['5', '10', '20', '50']}
                    size={window.innerWidth >= 640 ? "default" : "small"} // Smaller on mobile
                    className="text-center"
                    responsive={true}
                    showLessItems={window.innerWidth < 480} // Show fewer page numbers on very small screens
                    simple={window.innerWidth < 380} // Simple pagination on very small screens
                  />
                </div>
              </Row>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;