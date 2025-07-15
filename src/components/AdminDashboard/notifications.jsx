import React, { useState, useEffect } from 'react';
import { Card, Pagination, Spin, Alert, Badge, Empty, Select, Row, Col } from 'antd';
import { BellOutlined, ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAllNotifications } from '../../services/notification';

const { Option } = Select;

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [error, setError] = useState(null);

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
            // Add more action mappings as needed
        };

        return actionMap[action] || action.toLowerCase().replace('_', ' ');
    };

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
        };
        return colorMap[action] || 'default';
    };

    // Fetch notifications
    const fetchNotifications = async (page = 1, limit = itemsPerPage) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllNotifications(page, limit);

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
        fetchNotifications(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    // Handle page change
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        if (pageSize !== itemsPerPage) {
            setItemsPerPage(pageSize);
            setCurrentPage(1); // Reset to first page when changing page size
        }
    };

    // Handle page size change
    const handlePageSizeChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page
    };

    // Refresh notifications
    const handleRefresh = () => {
        fetchNotifications(currentPage, itemsPerPage);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <BellOutlined className="text-blue-500" />
                        Notifications
                    </h2>
                </div>
                <div className="flex justify-center items-center py-20">
                    <Spin size="large" tip="Loading notifications..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <BellOutlined className="text-blue-500" />
                        Notifications
                    </h2>
                </div>
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
        <div className=" mx-auto p-6">
            {/* Header with Controls */}
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

                </Row>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card className="text-center py-8">
                    <Empty
                        description="No notifications found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            ) : (
                <>
                    <div className="space-y-3 mb-6">
                        {notifications.map((notification) => (
                            <Card
                                key={notification._id}
                                className="transition-all duration-200 hover:shadow-md cursor-pointer hover:bg-gray-50"
                                bodyStyle={{ padding: '16px 20px' }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-medium text-gray-800">
                                                    {notification.facilityId?.name || 'Unknown Facility'}
                                                </span>
                                                <span className="text-gray-600">
                                                    {formatAction(notification.action)}
                                                </span>
                                                <Badge
                                                    color={getActionColor(notification.action)}
                                                    text={notification.action.replace('_', ' ')}
                                                    className="text-xs"
                                                />
                                            </div>

                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <ClockCircleOutlined className="text-xs" />
                                                {formatDate(notification.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Enhanced Pagination */}
                    {totalCount > 0 && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <Row justify="space-between" align="middle" className="flex-wrap gap-4">
                                <Col xs={24} sm={12} md={8}>
                                    <div className="text-sm text-gray-600">
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                                        {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} notifications
                                    </div>
                                </Col>

                                <Col xs={24} sm={12} md={16} className="flex justify-end">
                                    <Pagination
                                        current={currentPage}
                                        total={totalCount}
                                        pageSize={itemsPerPage}
                                        onChange={handlePageChange}
                                        onShowSizeChange={handlePageChange}
                                        showSizeChanger={true}
                                        showQuickJumper={true}
                                        showTotal={(total, range) =>
                                            `${range[0]}-${range[1]} of ${total}`
                                        }
                                        pageSizeOptions={['5', '10', '20', '50']}
                                        size="default"
                                        className="text-center"
                                        responsive={true}
                                    />
                                </Col>
                            </Row>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Notifications;