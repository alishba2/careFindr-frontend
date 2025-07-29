import React, { useState, useEffect } from 'react';
import { Card, Pagination, Spin, Alert, Badge, Empty, Select, Row, Col } from 'antd';
import { BellOutlined, ClockCircleOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllNotifications, markNotificationAsAdminRead, markAllAsAdminRead } from '../../services/notification';

const { Option } = Select;

const Notifications = ({ loc }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(loc === 'dashboard' ? 5 : 10);
    const [error, setError] = useState(null);

    // Check if this is dashboard mode
    const isDashboard = loc === 'dashboard';

    console.log(loc, "location is here");

    // Function to format action text
    const formatAction = (action) => {
        const actionMap = {
            'SERVICES_UPDATE': 'updated their services',
            'DOCUMENT_UPDATE': 'updated their documents',
            'PROFILE_UPDATE': 'updated their profile',
            'REGISTRATION': 'completed their registration',
            'NEW_REFERRAL': 'received a new patient referral',
            'FACILITY_APPROVED': 'was approved',
            'FACILITY_REJECTED': 'was rejected',
            'DOCUMENT_VERIFIED': 'had documents verified',
            'DOCUMENT_REJECTED': 'had documents rejected',
            'ONBOARDING_COMPLETED': 'completed onboarding',
            'ACCOUNT_CREATED': 'created their account',
            // Add more action mappings as needed
        };

        return actionMap[action] || action.toLowerCase().replace('_', ' ');
    };

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
        return `${Math.ceil(diffDays / 365)} years ago`;
    };

    // Get action color based on action type
    const getActionColor = (action) => {
        const colorMap = {
            'SERVICES_UPDATE': 'blue',
            'DOCUMENT_UPDATE': 'green',
            'PROFILE_UPDATE': 'purple',
            'REGISTRATION': 'cyan',
            'NEW_REFERRAL': 'orange',
            'FACILITY_APPROVED': 'green',
            'FACILITY_REJECTED': 'red',
            'DOCUMENT_VERIFIED': 'green',
            'DOCUMENT_REJECTED': 'red',
            'ONBOARDING_COMPLETED': 'cyan',
            'ACCOUNT_CREATED': 'blue',
        };
        return colorMap[action] || 'default';
    };

    // Get card styling based on read status
    const getCardClassName = (notification) => {
        const baseClasses = "transition-all duration-200 hover:shadow-md cursor-pointer";
        
        // Check if notification is read by admin
        const isRead = notification.adminRead;
        
        if (isRead) {
            // Read notifications - primary solid background
            return `${baseClasses} bg-[#c1e3ff]  text-black`;
        } else {
            // Unread notifications - white background with blue accent
            return `${baseClasses} bg-white hover:bg-blue-50 border-l-4 border-l-blue-500 shadow-sm`;
        }
    };

    // Mark notification as read
    const handleMarkAsRead = async (notificationId, event) => {
        // Prevent event bubbling
        event.stopPropagation();
        
        try {
            await markNotificationAsAdminRead(notificationId);
            
            // Update local state
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification._id === notificationId
                        ? { ...notification, adminRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsAdminRead();
            
            // Update local state - mark all as read
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({
                    ...notification,
                    adminRead: true
                }))
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Fetch notifications
    const fetchNotifications = async (page = 1, limit = itemsPerPage) => {
        try {
            setLoading(true);
            setError(null);
            
            // For dashboard mode, always get first 5
            const response = await getAllNotifications(isDashboard ? 1 : page, isDashboard ? 5 : limit);
            console.log('Fetched Notifications:', response);

            if (response && response.notifications) {
                setNotifications(response.notifications);
                setTotalCount(response.totalCount || response.notifications.length);
                setTotalPages(response.totalPages || Math.ceil((response.totalCount || response.notifications.length) / limit));
            }
        } catch (err) {
            setError('Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isDashboard) {
            // Dashboard mode: always fetch first 5
            fetchNotifications(1, 5);
        } else {
            // Full page mode: normal pagination
            fetchNotifications(currentPage, itemsPerPage);
        }
    }, [currentPage, itemsPerPage, isDashboard]);

    // Handle page change (only for non-dashboard mode)
    const handlePageChange = (page, pageSize) => {
        if (isDashboard) return; // Don't handle pagination in dashboard mode
        
        setCurrentPage(page);
        if (pageSize !== itemsPerPage) {
            setItemsPerPage(pageSize);
            setCurrentPage(1); // Reset to first page when changing page size
        }
    };

    // Handle page size change (only for non-dashboard mode)
    const handlePageSizeChange = (value) => {
        if (isDashboard) return;
        
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page
    };

    // Refresh notifications
    const handleRefresh = () => {
        if (isDashboard) {
            fetchNotifications(1, 5);
        } else {
            fetchNotifications(currentPage, itemsPerPage);
        }
    };

    if (loading) {
        return (
            <div className={isDashboard ? "" : "max-w-6xl mx-auto p-6"}>
                {!isDashboard && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                            <BellOutlined className="text-blue-500" />
                            Notifications
                        </h2>
                    </div>
                )}
                <div className="flex justify-center items-center py-20">
                    <Spin size="large" tip="Loading notifications..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={isDashboard ? "" : "max-w-6xl mx-auto p-6"}>
                {!isDashboard && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                            <BellOutlined className="text-blue-500" />
                            Notifications
                        </h2>
                    </div>
                )}
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Retry
                        </button>
                    }
                />
            </div>
        );
    }

    return (
        <div className={isDashboard ? "" : "mx-auto p-6"}>
            {/* Header with Controls - Only show in full page mode */}
            {!isDashboard && (
                <div className="mb-6">
                    <Row justify="space-between" align="middle" className="mb-4">
                        <Col>
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                <BellOutlined className="text-blue-500" />
                                Notifications
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {totalCount} total notifications • Page {currentPage} of {totalPages}
                            </p>
                        </Col>
                        <Col>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRefresh}
                                    className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 transition-colors flex items-center gap-1"
                                >
                                    <ReloadOutlined />
                                    Refresh
                                </button>
                                {notifications.some(n => !n.adminRead) && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                                    >
                                        <EyeOutlined />
                                        Mark All as Read
                                    </button>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            )}

            {/* Dashboard mode header */}
            {isDashboard && notifications.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Notifications</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRefresh}
                            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                            <ReloadOutlined />
                            Refresh
                        </button>
                        {notifications.some(n => !n.adminRead) && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                            >
                                <EyeOutlined />
                                Mark All Read
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card className="text-center py-8">
                    <Empty
                        description={isDashboard ? "No recent notifications" : "No notifications found"}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            ) : (
                <>
                    <div className={`space-y-3 ${isDashboard ? '' : 'mb-6'}`}>
                        {notifications.map((notification) => (
                            <Card
                                key={notification._id}
                                className={getCardClassName(notification)}
                                bodyStyle={{ padding: isDashboard ? '12px 16px' : '16px 20px' }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {/* Unread indicator */}
                                        {!notification.adminRead && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                        )}
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`font-medium ${notification.adminRead ? 'text-gray-800' : 'text-gray-800'} ${isDashboard ? 'text-sm' : ''}`}>
                                                    {notification?.facilityId?.name || 'Unknown Facility'}
                                                </span>
                                                <span className={`${notification.adminRead ? 'text-gray-800' : 'text-gray-700'} ${isDashboard ? 'text-sm' : ''}`}>
                                                    {formatAction(notification.action)}
                                                </span>
                                                {!isDashboard && (
                                                    <Badge
                                                        color={getActionColor(notification.action)}
                                                        text={notification.action.replace('_', ' ')}
                                                        className="text-xs"
                                                    />
                                                )}
                                            </div>

                                            <div className={`flex items-center gap-1 ${notification.adminRead ? 'text-blue-800' : 'text-gray-500'} ${isDashboard ? 'text-xs' : 'text-sm'}`}>
                                                <ClockCircleOutlined className="text-xs" />
                                                {formatDate(notification.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mark as read button - only show for unread notifications */}
                                    {!notification.adminRead && !isDashboard && (
                                        <div className="flex-shrink-0 ml-3">
                                            <button
                                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Mark as read"
                                            >
                                                <EyeOutlined className="text-sm" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Read status indicator for read notifications */}
                                    {notification.adminRead && !isDashboard && (
                                        <div className="flex-shrink-0 ml-3">
                                            <div className="p-2 text-white opacity-50" title="Read">
                                                <EyeOutlined className="text-sm" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Enhanced Pagination - Only show in full page mode */}
                    {!isDashboard && totalCount > 0 && (
                        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                            <Row justify="space-between" align="middle" className="flex-wrap gap-2 sm:gap-4">
                                {/* Pagination Controls */}
                                <Col xs={24} sm={24} md={12} lg={16} xl={16}>
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
                                </Col>
                            </Row>
                        </div>
                    )}

                    {/* Dashboard mode "View All" link */}
                    {isDashboard && notifications.length > 0 && (
                        <div className="mt-4 text-center">
                            <a 
                                href="/admin-dashboard/notifications" 
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                                View All Notifications →
                            </a>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Notifications;