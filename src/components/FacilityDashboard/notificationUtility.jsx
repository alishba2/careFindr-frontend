// utils/notificationUtils.js

/**
 * Get notification message based on action type
 * @param {string} action - The notification action type
 * @returns {string} - The formatted notification message
 */
export const getNotificationMessage = (action) => {
  switch (action) {
    case "ACCOUNT_CREATED":
      return "Your account has been successfully created. Let's complete your onboarding to get started!";
    case "RESET_PASSWORD":
      return "Your password has been reset. If this wasn't you, please secure your account immediately.";
    case "FACILITY_INFO_UPDATED":
      return "Your facility information has been successfully updated.";
    case "SERVICES_UPDATE":
      return "Your service offerings and capacity have been updated successfully.";
    case "DOCUMENT_UPDATE":
      return "Your facility documents were uploaded/updated successfully.";
    case "UPDATED_PROFILE_PROGRESS":
      return "Your profile setup is progressing. Keep going to complete it!";
    case "ONBOARDING_COMPLETED":
      return "Congratulations! You've successfully completed your onboarding process.";
    case "PROFILE_IMAGE_UPDATED":
      return "Your profile picture has been updated.";
    case "PROFILE_VERIFIED":
      return "Congratulations! Your profile has been successfully verified.";
    case "PROFILE_DEACTIVATED":
      return "Your profile has been deactivated. Please contact support if you believe this is an error.";
    case "PROFILE_ACTIVATED":
      return "Your profile has been activated and is now live on the platform.";
    case "DOCUMENT_REJECTED":
      return "Your document has been rejected. Please review the feedback and resubmit with corrections.";
    case "DOCUMENT_APPROVED":
    case "DOCUMENT_VERIFIED":
      return "Great news! Your document have been approved and verified successfully.";
    default:
      return "You have a new update or activity in your account.";
  }
};

/**
 * Get notification styling for Ant Design components
 * @param {string} action - The notification action type
 * @param {boolean} isRead - Whether the notification has been read (optional)
 * @returns {object} - Style object for Ant Design components
 */
export const getNotificationStyle = (action, isRead = false) => {
  let backgroundColor = !isRead ? "transparent" : "#c1e3ff";
  let borderColor = "#AADEE6";

  switch (action) {
    case "PROFILE_VERIFIED":
    case "PROFILE_ACTIVATED":
    case "DOCUMENT_APPROVED":
    case "DOCUMENT_VERIFIED":
      backgroundColor = !isRead ? "transparent" : "#d4edda"; // Light green
      borderColor = "#52c41a"; // Green border
      break;
    case "PROFILE_DEACTIVATED":
    case "DOCUMENT_REJECTED":
      backgroundColor = !isRead ? "transparent" : "#f8d7da"; // Light red
      borderColor = "#ff4d4f"; // Red border
      break;
    default:
      backgroundColor = !isRead ? "transparent" : "#c1e3ff";
      borderColor = "#AADEE6";
  }

  return {
    backgroundColor,
    borderColor,
    borderRadius: 8,
    marginBottom: 8,
    padding: 16,
  };
};

/**
 * Get notification styling for Tailwind CSS components
 * @param {string} action - The notification action type
 * @returns {string} - Tailwind CSS classes
 */
export const getNotificationTailwindStyle = (action) => {
  switch (action) {
    case "PROFILE_VERIFIED":
    case "PROFILE_ACTIVATED":
    case "DOCUMENT_APPROVED":
    case "DOCUMENT_VERIFIED":
      return "bg-green-50 border-green-200 border"; // Light green background with green border
    case "PROFILE_DEACTIVATED":
    case "DOCUMENT_REJECTED":
      return "bg-red-50 border-red-200 border"; // Light red background with red border
    default:
      return "bg-[#c1e3ff] border-[#AADEE6] border"; // Default blue styling
  }
};

/**
 * Get badge color based on action type (for Ant Design Badge)
 * @param {string} action - The notification action type
 * @returns {string} - Color code for the badge
 */
export const getBadgeColor = (action) => {
  switch (action) {
    case "PROFILE_VERIFIED":
    case "PROFILE_ACTIVATED":
    case "DOCUMENT_APPROVED":
    case "DOCUMENT_VERIFIED":
      return "#52c41a"; // Green
    case "PROFILE_DEACTIVATED":
    case "DOCUMENT_REJECTED":
      return "#ff4d4f"; // Red
    default:
      return "#1890ff"; // Default blue
  }
};

/**
 * Get notification icon based on action type
 * @param {string} action - The notification action type
 * @returns {string} - Icon name or component
 */
export const getNotificationIcon = (action) => {
  switch (action) {
    case "PROFILE_VERIFIED":
    case "PROFILE_ACTIVATED":
    case "DOCUMENT_APPROVED":
    case "DOCUMENT_VERIFIED":
      return "check-circle"; // Success icon
    case "PROFILE_DEACTIVATED":
    case "DOCUMENT_REJECTED":
      return "close-circle"; // Error icon
    case "ACCOUNT_CREATED":
    case "ONBOARDING_COMPLETED":
      return "user-add"; // User related
    case "RESET_PASSWORD":
      return "lock"; // Security related
    case "DOCUMENT_UPDATE":
      return "file-text"; // Document related
    default:
      return "bell"; // Default notification icon
  }
};

/**
 * Get notification priority/severity level
 * @param {string} action - The notification action type
 * @returns {string} - Priority level (high, medium, low)
 */
export const getNotificationPriority = (action) => {
  switch (action) {
    case "PROFILE_DEACTIVATED":
    case "DOCUMENT_REJECTED":
    case "RESET_PASSWORD":
      return "high";
    case "PROFILE_VERIFIED":
    case "PROFILE_ACTIVATED":
    case "DOCUMENT_APPROVED":
    case "DOCUMENT_VERIFIED":
    case "ONBOARDING_COMPLETED":
      return "medium";
    default:
      return "low";
  }
};

/**
 * Format notification date
 * @param {string|Date} dateString - The date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatNotificationDate = (dateString, options = {}) => {
  const defaultOptions = {
    dateStyle: "medium",
    timeStyle: "short",
    ...options
  };
  
  return new Date(dateString).toLocaleString("en-US", defaultOptions);
};

/**
 * Group notifications by date
 * @param {Array} notifications - Array of notification objects
 * @returns {Object} - Notifications grouped by date
 */
export const groupNotificationsByDate = (notifications) => {
  return notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});
};

/**
 * Filter notifications by priority
 * @param {Array} notifications - Array of notification objects
 * @param {string} priority - Priority level to filter by
 * @returns {Array} - Filtered notifications
 */
export const filterNotificationsByPriority = (notifications, priority) => {
  return notifications.filter(notification => 
    getNotificationPriority(notification.action) === priority
  );
};

/**
 * Get unread notification count
 * @param {Array} notifications - Array of notification objects
 * @returns {number} - Count of unread notifications
 */
export const getUnreadCount = (notifications) => {
  return notifications.filter(notification => !notification.isRead).length;
};