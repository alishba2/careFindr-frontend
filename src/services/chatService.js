// services/chatService.js
import { io } from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.baseURL =  'http://localhost:8000';
    this.apiBaseURL = `${this.baseURL}/api/chat`;
    this.isConnected = false;
    this.eventListeners = new Map();
  }

  // Initialize socket connection
  connect(token) {
    console.log("connected");
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

  // Get authorization headers
  getHeaders(token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // API Calls

  // Admin APIs
  async getAllChats(token, params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 20,
      status: params.status || 'all',
      priority: params.priority || 'all'
    });

    const response = await fetch(`${this.apiBaseURL}/admin/chats?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chats: ${response.statusText}`);
    }

    return await response.json();
  }

  async getChatStats(token) {
    const response = await fetch(`${this.apiBaseURL}/admin/chats/stats`, {
      method: 'GET',
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chat stats: ${response.statusText}`);
    }

    return await response.json();
  }

  async getChatByFacility(token, facilityId) {
    const response = await fetch(`${this.apiBaseURL}/admin/chats/${facilityId}`, {
      method: 'GET',
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch facility chat: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateChatStatus(token, chatId, statusData) {
    const response = await fetch(`${this.apiBaseURL}/admin/chats/${chatId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(statusData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update chat status: ${response.statusText}`);
    }

    return await response.json();
  }

  // Facility APIs
  async getFacilityChat(token) {
    const response = await fetch(`${this.apiBaseURL}/facility/chat`, {
      method: 'GET',
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch facility chat: ${response.statusText}`);
    }

    return await response.json();
  }

  // Shared APIs
  async sendMessage(token, messageData) {
    const response = await fetch(`${this.apiBaseURL}/message`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return await response.json();
  }

  async markAsRead(token, chatId) {
    const response = await fetch(`${this.apiBaseURL}/chats/${chatId}/read`, {
      method: 'PUT',
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      throw new Error(`Failed to mark as read: ${response.statusText}`);
    }

    return await response.json();
  }

  // Socket Methods

  // Send message via socket
  sendMessageSocket(messageData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', messageData);
    } else {
      console.error('Socket not connected');
    }
  }

  // Send typing indicator
  sendTyping(chatId, isTyping, facilityId = null) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { chatId, isTyping, facilityId });
    }
  }

  // Mark messages as read via socket
  markAsReadSocket(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark-read', { chatId });
    }
  }

  // Update chat status via socket (admin only)
  updateChatStatusSocket(chatId, statusData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update-chat-status', { chatId, ...statusData });
    }
  }

  // Join specific chat room
  joinChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-chat', { chatId });
    }
  }

  // Leave chat room
  leaveChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-chat', { chatId });
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

  // Listen for errors
  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
      this.eventListeners.set('error', callback);
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
  reconnect(token) {
    this.disconnect();
    return this.connect(token);
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;
