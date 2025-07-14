// services/chatService.js
import { io } from 'socket.io-client';
import axios from "axios";

// Axios configuration
const { CancelToken } = axios;
const source = CancelToken.source();

// Create axios instance for chat service
const chatAxios = axios.create({
  baseURL: 'http://localhost:8000/api/chat',
  timeout: 10000,
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
    this.baseURL = import.meta.env.VITE_APP_BASE_URL;
    this.isConnected = false;
    this.eventListeners = new Map();
    this.cancelSource = source;
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

  async assignChat(chatId, adminId) {
    try {
      const response = await chatAxios.put(`/admin/chats/${chatId}/assign`, { adminId });
      return response.data;
    } catch (error) {
      console.error('Error assigning chat:', error);
      throw this.handleError(error);
    }
  }

  async closeChat(chatId, reason = '') {
    try {
      const response = await chatAxios.put(`/admin/chats/${chatId}/close`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error closing chat:', error);
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

  async createFacilityChat(initialMessage) {
    try {
      const response = await chatAxios.post('/facility/chat', { 
        message: initialMessage 
      });
      return response.data;
    } catch (error) {
      console.error('Error creating facility chat:', error);
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

  async uploadFile(file, chatId) {
    try {
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

  async deleteMessage(messageId) {
    try {
      const response = await chatAxios.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw this.handleError(error);
    }
  }

  async editMessage(messageId, newContent) {
    try {
      const response = await chatAxios.put(`/messages/${messageId}`, { 
        content: newContent 
      });
      return response.data;
    } catch (error) {
      console.error('Error editing message:', error);
      throw this.handleError(error);
    }
  }

  // Socket Methods

  // Send message via socket
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

  // Join admin room (for admin users)
  joinAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-admin-room');
      console.log('Joined admin room');
    }
  }

  // Event Listeners

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new-message', callback);
      this.eventListeners.set('new-message', callback);
    }
  }

  // Listen for typing indicators
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

  // Listen for read status
  onMessagesRead(callback) {
    if (this.socket) {
      this.socket.on('messages-read', callback);
      this.eventListeners.set('messages-read', callback);
    }
  }

  // Listen for chat status updates
  onChatStatusUpdated(callback) {
    if (this.socket) {
      this.socket.on('chat-status-updated', callback);
      this.eventListeners.set('chat-status-updated', callback);
    }
  }

  // Listen for message sent confirmation
  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message-sent', callback);
      this.eventListeners.set('message-sent', callback);
    }
  }

  // Listen for marked read confirmation
  onMarkedRead(callback) {
    if (this.socket) {
      this.socket.on('marked-read', callback);
      this.eventListeners.set('marked-read', callback);
    }
  }

  // Listen for status update confirmation
  onStatusUpdated(callback) {
    if (this.socket) {
      this.socket.on('status-updated', callback);
      this.eventListeners.set('status-updated', callback);
    }
  }

  // Listen for chat assignment updates
  onChatAssigned(callback) {
    if (this.socket) {
      this.socket.on('chat-assigned', callback);
      this.eventListeners.set('chat-assigned', callback);
    }
  }

  // Listen for chat closed events
  onChatClosed(callback) {
    if (this.socket) {
      this.socket.on('chat-closed', callback);
      this.eventListeners.set('chat-closed', callback);
    }
  }

  // Listen for errors
  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
      this.eventListeners.set('error', callback);
    }
  }

  // Listen for connection events
  onConnect(callback) {
    if (this.socket) {
      this.socket.on('connect', callback);
      this.eventListeners.set('connect', callback);
    }
  }

  onDisconnect(callback) {
    if (this.socket) {
      this.socket.on('disconnect', callback);
      this.eventListeners.set('disconnect', callback);
    }
  }

  // Remove event listeners
  removeListener(eventName) {
    if (this.socket && this.eventListeners.has(eventName)) {
      this.socket.off(eventName, this.eventListeners.get(eventName));
      this.eventListeners.delete(eventName);
    }
  }

  // Remove all event listeners
  removeAllListeners() {
    if (this.socket) {
      this.eventListeners.forEach((callback, eventName) => {
        this.socket.off(eventName, callback);
      });
      this.eventListeners.clear();
    }
  }

  // Utility Methods

  // Check if socket is connected
  isSocketConnected() {
    return this.isConnected && this.socket && this.socket.connected;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Reconnect socket
  reconnect() {
    const token = localStorage.getItem('token');
    this.disconnect();
    return this.connect(token);
  }

  // Error handling helper
  handleError(error) {
    if (error.isCancel) {
      return error;
    }

    if (error.response) {
      // Server responded with error status
      const errorMsg = error.response.data?.message || error.response.data?.msg || 'Server error';
      return new Error(`${errorMsg} (Status: ${error.response.status})`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error - no response from server');
    } else {
      // Something else happened
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

  // Update base URL for different environments
  updateBaseURL(newBaseURL) {
    this.baseURL = newBaseURL;
    chatAxios.defaults.baseURL = `${newBaseURL}/api/chat`;
  }

  // Retry failed request
  async retryRequest(requestFunction, maxRetries = 3) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFunction();
      } catch (error) {
        lastError = error;
        if (error.isCancel) {
          throw error; // Don't retry cancelled requests
        }
        
        // Wait before retrying (exponential backoff)
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    
    throw lastError;
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;