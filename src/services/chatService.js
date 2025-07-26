// services/chatService.js - Updated with file upload support
import { io } from 'socket.io-client';
import axios from "axios";

// Axios configuration
const { CancelToken } = axios;
const source = CancelToken.source();

// Create axios instance for chat service
const chatAxios = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}/api/chat`,
  timeout: 30000, // Increased timeout for file uploads
});

// Request interceptor
chatAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log(token, "token is here herer");
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  config.cancelToken = source.token;
  return config;
});

// Response interceptor
chatAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject({ isCancel: true, message: "Request cancelled" });
    } else {
      return Promise.reject(error);
    }
  }
);

class ChatService {
  constructor() {
    this.socket = null;
    this.baseURL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8000';
    this.isConnected = false;
    this.eventListeners = new Map();
    this.cancelSource = source;
  }

  // File validation helper
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];

    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported`);
    }

    return true;
  }

  // Initialize socket connection
  connect(token) {
    console.log("connecting to chat server...");
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(this.baseURL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Cancel all pending requests
  cancelRequests() {
    this.cancelSource.cancel('Operation cancelled by user');
  }

  // API Calls using Axios

  // Admin APIs
  async getAllChats(params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 20,
        status: params.status || 'all',
        priority: params.priority || 'all'
      };

      const response = await chatAxios.get('/admin/chats', {
        params: queryParams
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching all chats:', error);
      throw this.handleError(error);
    }
  }

  async getChatStats() {
    try {
      const response = await chatAxios.get('/admin/chats/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw this.handleError(error);
    }
  }

  async getChatByFacility(facilityId) {
    try {
      const response = await chatAxios.get(`/admin/chats/${facilityId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching facility chat:', error);
      throw this.handleError(error);
    }
  }

  async updateChatStatus(chatId, statusData) {
    try {
      const response = await chatAxios.put(`/admin/chats/${chatId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating chat status:', error);
      throw this.handleError(error);
    }
  }

  // Facility APIs
  async getFacilityChat() {
    try {
      const response = await chatAxios.get('/facility/chat');
      return response.data;
    } catch (error) {
      console.error('Error fetching facility chat:', error);
      throw this.handleError(error);
    }
  }

  // Shared APIs
  async sendMessage(messageData) {
    try {
      const response = await chatAxios.post('/message', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw this.handleError(error);
    }
  }

  // NEW: Send message with file support
  async sendMessageWithFile({ message, messageType = 'file', file, chatId, facilityId }) {
    try {
      // Validate file before sending
      this.validateFile(file);

      // Create FormData for file upload
      const formData = new FormData();

      // Add text fields to FormData
      if (message) {
        formData.append('message', message);
      }

      if (messageType) {
        formData.append('messageType', messageType);
      }

      if (chatId) {
        formData.append('chatId', chatId);
      }

      if (facilityId) {
        formData.append('facilityId', facilityId);
      }

      // Add the file to FormData
      if (file) {
        formData.append('file', file);
      }

      console.log('📤 Sending FormData with file:', {
        hasFile: !!file,
        fileName: file?.name,
        fileSize: file?.size,
        chatId: chatId,
        facilityId: facilityId
      });

      // Send request with FormData using chatAxios (which already has auth headers)
      const response = await chatAxios.post('/message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📤 Upload Progress: ${percentCompleted}%`);
        }
      });

      console.log('✅ File message sent successfully:', response.data);
      return { success: true, data: response.data.data };

    } catch (error) {
      console.error('❌ Error sending file message:', error);
      throw this.handleError(error);
    }
  }

  async markAsRead(chatId) {
    try {
      const response = await chatAxios.put(`/chats/${chatId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw this.handleError(error);
    }
  }

  async getChatMessages(chatId, params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 50,
        ...params
      };

      const response = await chatAxios.get(`/chats/${chatId}/messages`, {
        params: queryParams
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw this.handleError(error);
    }
  }

  // UPDATED: uploadFile method for standalone file uploads
  async uploadFile(file, chatId) {
    try {
      this.validateFile(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', chatId);

      const response = await chatAxios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw this.handleError(error);
    }
  }

  // NEW: Get file info
  async getFileInfo(filename) {
    try {
      const response = await chatAxios.get(`/file-info/${filename}`);
      return response.data;
    } catch (error) {
      console.error('Error getting file info:', error);
      throw this.handleError(error);
    }
  }



  // Socket Methods
  sendMessageSocket(messageData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', messageData);
    } else {
      console.error('Socket not connected');
      throw new Error('Socket not connected');
    }
  }

  // Send typing indicator
  sendTyping(chatId, isTyping, facilityId = null) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { chatId, isTyping, facilityId });
    } else {
      console.warn('Socket not connected for typing indicator');
    }
  }

  // Mark messages as read via socket
  markAsReadSocket(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark-read', { chatId });
    } else {
      console.warn('Socket not connected for mark as read');
    }
  }

  // Update chat status via socket (admin only)
  updateChatStatusSocket(chatId, statusData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update-chat-status', { chatId, ...statusData });
    } else {
      console.warn('Socket not connected for status update');
    }
  }

  // Join specific chat room
  joinChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-chat', { chatId });
      console.log(`Joined chat: ${chatId}`);
    } else {
      console.warn('Socket not connected for joining chat');
    }
  }

  // Leave chat room
  leaveChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-chat', { chatId });
      console.log(`Left chat: ${chatId}`);
    } else {
      console.warn('Socket not connected for leaving chat');
    }
  }

  // Event Listeners (keeping all existing listeners)
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new-message', callback);
      this.eventListeners.set('new-message', callback);
    }
  }

  onAdminTyping(callback) {
    if (this.socket) {
      this.socket.on('admin-typing', callback);
      this.eventListeners.set('admin-typing', callback);
    }
  }

  onFacilityTyping(callback) {
    if (this.socket) {
      this.socket.on('facility-typing', callback);
      this.eventListeners.set('facility-typing', callback);
    }
  }

  onMessagesRead(callback) {
    if (this.socket) {
      this.socket.on('messages-read', callback);
      this.eventListeners.set('messages-read', callback);
    }
  }

  onChatStatusUpdated(callback) {
    if (this.socket) {
      this.socket.on('chat-status-updated', callback);
      this.eventListeners.set('chat-status-updated', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message-sent', callback);
      this.eventListeners.set('message-sent', callback);
    }
  }

  onMarkedRead(callback) {
    if (this.socket) {
      this.socket.on('marked-read', callback);
      this.eventListeners.set('marked-read', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
      this.eventListeners.set('error', callback);
    }
  }

  // Utility Methods
  isSocketConnected() {
    return this.isConnected && this.socket && this.socket.connected;
  }

  getSocket() {
    return this.socket;
  }

  reconnect() {
    const token = localStorage.getItem('token');
    this.disconnect();
    return this.connect(token);
  }

  removeListener(eventName) {
    if (this.socket && this.eventListeners.has(eventName)) {
      this.socket.off(eventName, this.eventListeners.get(eventName));
      this.eventListeners.delete(eventName);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.eventListeners.forEach((callback, eventName) => {
        this.socket.off(eventName, callback);
      });
      this.eventListeners.clear();
    }
  }

  // Error handling helper
  handleError(error) {
    if (error.isCancel) {
      return error;
    }

    if (error.response) {
      const errorMsg = error.response.data?.message || error.response.data?.msg || 'Server error';
      return new Error(`${errorMsg} (Status: ${error.response.status})`);
    } else if (error.request) {
      return new Error('Network error - no response from server');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      socket: this.isSocketConnected(),
      api: chatAxios.defaults.baseURL
    };
  }

  // Helper method to get file icon based on type
  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.startsWith('text/')) return '📋';
    return '📎';
  }

  // Helper method to format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;