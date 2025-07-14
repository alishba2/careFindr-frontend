import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Search, Filter, MoreVertical, Phone, Mail, Clock, User, MessageSquare, AlertCircle, CheckCircle2, Circle, Loader, RefreshCw } from 'lucide-react';
import { useChat } from '../hook/chatContext';
import { useAuth } from '../hook/auth';
import { getAllFacilities } from '../../services/facility';

const AdminChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  
  const {
    chats,
    activeChat,
    messages,
    unreadCount,
    isTyping,
    typingUsers,
    isConnected,
    loading,
    error,
    chatStats,
    isAdmin,
    sendMessage,
    markAsRead,
    updateChatStatus,
    sendTyping,
    selectChat,
    fetchAllChats,
    fetchChatByFacility,
    refreshChats,
    setError,
    setActiveChat,
    setMessages
  } = useChat();

  const { role } = useAuth();

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [facilities, setFacilities] = useState([]);
  const [allItems, setAllItems] = useState([]); // Combined chats and facilities

  // Helper functions (defined before they're used)
  const getCurrentTypingForChat = (chatId) => {
    return typingUsers.find(user => user.chatId === chatId);
  };

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages yet";
    }
    return chat.messages[chat.messages.length - 1].message;
  };

  const getLastMessageTime = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return chat.createdAt || chat.lastMessageAt;
    }
    return chat.messages[chat.messages.length - 1].timestamp;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      case 'resolved': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Fetch facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await getAllFacilities({ page: 1, limit: 100 }); // Get more facilities
        console.log(res, "response here");
        setFacilities(res.data?.facilities || res.facilities || []);
      } catch (err) {
        console.error("Failed to fetch all facilities:", err);
      }
    };

    fetchFacilities();
  }, []);

  // Combine chats and facilities, avoiding duplicates
  useEffect(() => {
    const chatFacilityIds = new Set(chats.map(chat => chat.facilityId?._id || chat.facilityId).filter(Boolean));
    
    // Facilities that don't have chats yet
    const facilitiesWithoutChats = facilities.filter(facility => 
      !chatFacilityIds.has(facility._id)
    ).map(facility => ({
      ...facility,
      type: 'facility', // Mark as facility for identification
      facilityName: facility.name,
      facilityId: facility._id,
      messages: [],
      status: 'new',
      priority: 'medium'
    }));

    // Mark existing chats
    const existingChats = chats.map(chat => ({
      ...chat,
      type: 'chat'
    }));

    // Combine and sort by last activity
    const combined = [...existingChats, ...facilitiesWithoutChats].sort((a, b) => {
      const timeA = a.type === 'chat' ? new Date(getLastMessageTime(a)) : new Date(a.createdAt || 0);
      const timeB = b.type === 'chat' ? new Date(getLastMessageTime(b)) : new Date(b.createdAt || 0);
      return timeB - timeA;
    });

    setAllItems(combined);
  }, [chats, facilities]);

  // Filter items based on search and filters
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.facilityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.messages?.some(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // For chats, apply status and priority filters
    if (item.type === 'chat') {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    }
    
    // For facilities without chats, show them (they're "new" status by default)
    const matchesStatus = statusFilter === 'all' || statusFilter === 'new';
    return matchesSearch && matchesStatus;
  });

  // Handle URL routing - load chat when chatId changes
  useEffect(() => {
    if (chatId && allItems.length > 0) {
      if (chatId.startsWith('new_')) {
        // This is a new facility chat
        const facilityId = chatId.replace('new_', '');
        const facility = allItems.find(item => item.type === 'facility' && item._id === facilityId);
        if (facility) {
          handleSelectChatInternal(facility);
        }
      } else {
        // This is an existing chat
        const chat = allItems.find(item => item.type === 'chat' && item._id === chatId);
        if (chat) {
          handleSelectChatInternal(chat);
        }
      }
    }
  }, [chatId, allItems]);

  // Load chats on component mount and when filters change
  useEffect(() => {
    if (role === "admin") {
      const filterParams = {};
      if (statusFilter !== 'all') filterParams.status = statusFilter;
      if (priorityFilter !== 'all') filterParams.priority = priorityFilter;
      fetchAllChats(filterParams);
    }
  }, [statusFilter, priorityFilter, role]);

  // Debug effect to monitor socket connection and active chat
  useEffect(() => {
    console.log('Socket connected:', isConnected);
    console.log('Active chat:', activeChat?._id);
    console.log('Current messages count:', messages.length);
  }, [isConnected, activeChat, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Internal function to handle chat selection without URL navigation
  const handleSelectChatInternal = async (item) => {
    if (activeChat && String(activeChat._id) === String(item._id)) return;

    try {
      // Leave previous chat room if exists
      if (activeChat) {
        // Assuming you have a leaveChat method in chatService
        // chatService.leaveChat(activeChat._id);
      }

      if (item.type === 'facility') {
        // This is a facility without a chat - create/fetch the chat
        const facilityId = item._id;
        
        // Create a temporary chat object immediately for better UX
        const tempChat = {
          _id: `temp_${facilityId}`,
          facilityId: facilityId,
          facilityName: item.name,
          email: item.email,
          messages: [],
          status: 'open',
          priority: 'medium',
          type: 'new_chat'
        };
        setActiveChat(tempChat);
        setMessages([]);
        
        // Try to fetch existing chat, but don't fail if none exists
        try {
          const existingChat = await fetchChatByFacility(facilityId);
          if (existingChat) {
            // If chat exists, update the URL to reflect the real chat ID
            navigate(`/admin-dashboard/conversations/${existingChat._id}`, { replace: true });
          }
        } catch (error) {
          // If no chat exists, that's fine - we'll create one when sending the first message
          console.log("No existing chat found, will create new one when message is sent");
        }
      } else {
        // This is an existing chat
        setActiveChat(item);
        setMessages(item.messages || []);

        if (item.facilityId?._id) {
          // Fetch additional data if needed
          await fetchChatByFacility(item.facilityId._id);
        } else {
          selectChat(item);
        }

        // Mark messages as read for admin
        markAsRead(item._id);
      }
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };

  // Public function to handle chat selection with URL navigation
  const handleSelectChat = async (item) => {
    // Navigate to the chat URL
    const chatId = item.type === 'facility' ? `new_${item._id}` : item._id;
    navigate(`/admin-dashboard/conversations/${chatId}`);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      await sendMessage({
        message: message.trim(),
        messageType: 'text'
      });
      setMessage('');
      // No need to refresh all chats - the message will be updated via socket events
      // or the sendMessage function will handle local state updates
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status, priority) => {
    if (!activeChat) return;

    try {
      await updateChatStatus(activeChat._id, { status, priority });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleTyping = () => {
    sendTyping(true);
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Show loading or error states for non-admin users
  if (role !== "admin") {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Chat Support</h1>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <button
                onClick={refreshChats}
                disabled={loading}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total</div>
              <div className="text-lg font-semibold text-blue-900">{chatStats.totalChats || 0}</div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Open</div>
              <div className="text-lg font-semibold text-green-900">{chatStats.openChats || 0}</div>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Unread</div>
              <div className="text-lg font-semibold text-yellow-900">{chatStats.unreadMessages || 0}</div>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Resolved</div>
              <div className="text-lg font-semibold text-purple-900">{chatStats.resolvedChats || 0}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="resolved">Resolved</option>
              <option value="new">New Facilities</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const typingUser = item.type === 'chat' ? getCurrentTypingForChat(item._id) : null;
              const isActive = activeChat?._id === item._id || 
                              (activeChat?.type === 'new_chat' && activeChat?.facilityId?._id === item._id);
              
              return (
                <div
                  key={item._id}
                  onClick={() => handleSelectChat(item)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.type === 'facility' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <User className={`w-5 h-5 ${
                          item.type === 'facility' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.facilityName || item.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'facility' 
                              ? 'text-green-600 bg-green-100' 
                              : getStatusColor(item.status)
                          }`}>
                            {item.type === 'facility' ? 'new' : item.status}
                          </span>
                          {item.type === 'chat' && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {item.type === 'facility' 
                          ? formatDate(item.createdAt) 
                          : formatDate(getLastMessageTime(item))
                        }
                      </div>
                      {item.type === 'chat' && item.unreadCount?.admin > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1 ml-auto">
                          {item.unreadCount.admin}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {typingUser ? (
                    <p className="text-sm text-blue-600 italic">
                      {typingUser.facilityName} is typing...
                    </p>
                  ) : item.type === 'facility' ? (
                    <p className="text-sm text-gray-500 italic">
                      Click to start conversation
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 truncate">
                      {getLastMessage(item)}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{activeChat.facilityName || activeChat.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      {activeChat.facilityId?.email || activeChat.email || 'No email available'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={activeChat.status || 'open'}
                    onChange={(e) => handleUpdateStatus(e.target.value, activeChat.priority)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  <select
                    value={activeChat.priority || 'medium'}
                    onChange={(e) => handleUpdateStatus(activeChat.status, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.senderType === 'Admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.senderType === 'Admin'
                          ? 'bg-primarysolid text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className={`text-xs mt-1 ${
                        msg.senderType === 'Admin' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="text-sm text-gray-600">Facility is typing...</div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                  className="bg-primarysolid text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a facility from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;